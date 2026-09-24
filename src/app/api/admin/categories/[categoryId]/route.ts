import { prisma } from "../../../../../db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

// rename a category
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name } = await req.json();
    const { categoryId } = await params;

    if (!name) {
      return Response.json(
        { success: false, error: "Missing required field: 'name'" },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    return Response.json(
      {
        success: true,
        message: "Category name updated successfully",
        category,
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return Response.json(
        { success: false, error: "A category with this name already exists" },
        { status: 409 },
      );
    }
    console.log("Failed to update category:", error.message);
    return Response.json(
      {
        success: false,
        error: "Error updating category",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// remove a category
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { categoryId } = await params;
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await prisma.$transaction([
      prisma.walkthroughCategory.deleteMany({
        where: { category_id: categoryId },
      }),

      prisma.category.delete({
        where: { id: categoryId },
      }),
    ]);

    return Response.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Failed to delete category:", error.message);
    return Response.json(
      {
        success: false,
        error: "Error deleting category",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
