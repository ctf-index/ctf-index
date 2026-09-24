import { prisma } from "../../../db/client";

// public walkthrough home feed and walkthrough search api
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const category = searchParams.get("category");

    const walkthroughs = await prisma.walkthrough.findMany({
      where: {
        status: "verified",
        ...(category && { categories: { some: { category_id: category } } }),
      },
      include: {
        categories: { include: { category: true }, omit: { walkthrough_id: true, category_id: true } },
      },
      take: 10,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    const nextCursor =
      walkthroughs.length === 10
        ? walkthroughs[walkthroughs.length - 1].id
        : null;

    return Response.json(
      {
        success: true,
        message: "Walkthroughs fetched successfully",
        walkthroughs,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Failed to fetch walkthroughs: ", error.message);
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
