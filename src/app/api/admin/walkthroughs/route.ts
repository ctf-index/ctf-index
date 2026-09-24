import { prisma } from "../../../../db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// Save walkthrough for review later
export async function POST(req: Request) {
  try {
    const { title, link, description } = await req.json();
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id;

    if (!adminId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!title || !link) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: 'title' or 'link'",
        },
        { status: 400 },
      );
    }

    const isAlreadyAdded = await prisma.walkthrough.findFirst({
      where: { link },
      select: { id: true },
    });

    if (isAlreadyAdded) {
      return Response.json(
        {
          error: "Walkthrough is already saved in db",
          WalkthroughId: isAlreadyAdded.id,
        },
        { status: 400 },
      );
    }

    const walkthrough = await prisma.walkthrough.create({
      data: {
        title,
        link,
        description: description ?? "",
        status: "pending",
        link_status: "alive",
        last_checked_at: new Date(),
        quality_score: 0,
        archived_snapshot_link: "",
        difficulty: "beginner",
        added_by: adminId,
      },
    });
    return Response.json(
      {
        success: true,
        message: "Walkthrough saved successfully",
        walkthrough,
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma's unique constraint violation code
      return Response.json(
        { success: false, error: "Walkthrough with this link already exists" },
        { status: 409 },
      );
    }
    console.error("Failed to create walkthrough:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to save walkthrough",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// get all saved walkthrough
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "pending"; // default to pending request

    const walkthroughs = await prisma.walkthrough.findMany({
      where: { status: status as any },
      include: {
        categories: {
          select: {
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(
      {
        success: true,
        message: "Walkthrough fetched successfully",
        walkthroughs,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error fetching walkthrough: ", error.message);
    return Response.json(
      {
        success: false,
        error: "Error fetching walkthrough",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
