import { prisma } from "../../../../db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// Get all categories (used to populate the multi-select in the review form)
export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc'}
    })

    return Response.json(
      { 
        success: true, 
        message: 'Categories fetched successfully',
        categories 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Failed to fetch categories:", error.message);
    return Response.json(
      { success: false, error: "Error fetching categories", details: error.message },
      { status: 500 }
    );
  }
}

// create a new category
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const { name } = await req.json()

    if (!name) {
      return Response.json(
        { success: false, error: "Missing required field: 'name'" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name }
    })
    return Response.json(
      { 
        success: true,
        message: 'Category saved successfully',
        category 
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return Response.json(
        { success: false, error: "A category with this name already exists" },
        { status: 409 }
      );
    }
    console.log("Failed to create category:", error.message);
    return Response.json(
      { success: false, error: "Error creating category", details: error.message },
      { status: 500 }
    );
  }
}