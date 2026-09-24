import { prisma } from "../../../../../db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

// method to archive walkthrough link
async function archiveUrl(originalUrl: string): Promise<string | null> {
  try {
    const res = await fetch("https://web.archive.org/save", {
      method: "POST",
      headers: {
        Authorization: `LOW ${process.env.ARCHIVE_ACCESS_KEY}:${process.env.ARCHIVE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `url=${encodeURIComponent(originalUrl)}`,
    });

    if (!res.ok) return null;

    const data = await res.json();

    // SPN2 returns a job_id — the capture happens asynchronously
    return data.job_id ? `https://web.archive.org/web/${originalUrl}` : null;
  } catch (error: any) {
    console.log("Archiving failed:", error.message);
    return null;
  }
}

// Update Walkthrough
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ walkthroughId: string }> },
) {
  try {
    const { walkthroughId } = await params;
    const session = await getServerSession(authOptions);
    const adminId = session?.user.id;

    if (!adminId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let archived_snapshot_link: string | undefined;
    let archiveWarning: string | undefined;

    if (body.status === "verified" && body.link) {
      const result = await archiveUrl(body.link);

      if (result) {
        archived_snapshot_link = result;
      } else {
        console.log(
          `Archiving failed for ${body.link} — publishing without snapshot`,
        );
        archiveWarning =
          "Could not archive this link automatically. The walkthrough was still published, but has no fallback snapshot if the original link ever goes dead.";
      }
    }

    const updated = await prisma.walkthrough.update({
      where: { id: walkthroughId },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.link_status && { link_status: body.link_status }),
        ...(body.quality_score !== undefined && {
          quality_score: body.quality_score,
        }),
        ...(archived_snapshot_link && { archived_snapshot_link }),
        ...(body.difficulty && { difficulty: body.difficulty }),
        ...(body.status && { status: body.status }),
        reviewed_by: adminId,
      },
      include: {
        categories: {
          select: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (body.categories) {
      await prisma.$transaction([
        prisma.walkthroughCategory.deleteMany({
          where: { walkthrough_id: walkthroughId },
        }),
        prisma.walkthroughCategory.createMany({
          data: body.categories.map((categoriesId: string) => ({
            walkthrough_id: walkthroughId,
            category_id: categoriesId,
          })),
        }),
      ]);
    }

    return Response.json(
      {
        success: true,
        message: (archiveWarning ? archiveWarning : "Walkthrough updated successfully"),
        updated,

      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Failed to update walkthrough:", error);
    return Response.json(
      { error: "Failed to update walkthrough", details: error.message },
      { status: 500 },
    );
  }
}

// Delete Walkthrough
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ walkthroughId: string }> },
) {
  try {
    const { walkthroughId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 },
      );
    }

    if (!walkthroughId) {
      return Response.json(
        { success: false, error: "Missing required field: 'walkthroughId'" },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.walkthroughCategory.deleteMany({
        where: { walkthrough_id: walkthroughId },
      }),

      prisma.walkthrough.delete({
        where: { id: walkthroughId },
      }),
    ]);

    return Response.json(
      { success: true, message: "Walkthrough deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error in deleting walkthrough route: ", error.message);
    return Response.json(
      {
        success: false,
        error: "Error deleting walkthrough",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
