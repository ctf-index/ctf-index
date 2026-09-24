import { prisma } from "../../../../db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// New admin invite link generation
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const admin = await prisma.admin.findUnique({ where: { id: session?.user?.id } })

    if (!admin?.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!admin?.canInvite) {
      return Response.json({ error: "You don't have permission to invite admins" }, { status: 403 });
    }

    const { canInviteForNewAdmin } = await req.json()  // the toggle value from the form

    const invite = await prisma.adminInvite.create({
      data: {
        token: crypto.randomUUID(),
        canInvite: canInviteForNewAdmin ?? false,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60* 24 * 1), // valid for 1 day
        createdBy: admin.id
      }
    })

    return Response.json(
      { 
        success: true,
        message: 'Admin invite link generated successfully',
        inviteUrl: `${process.env.WEBSITE_URL}/admin/sign-up?invite=${invite.token}` // frontend invite url
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