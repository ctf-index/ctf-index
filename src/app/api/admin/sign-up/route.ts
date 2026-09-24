import { prisma } from "../../../../db/client";
import bcrypt from "bcrypt";

// Admin sign-up
export async function POST(req: Request) {
  try {
    const { token, username, email, password } = await req.json();

    const invite = await prisma.adminInvite.findUnique({ where: { token } });

    if (!invite || invite.expiresAt < new Date() || invite.used) {
      return Response.json({ error: "Invalid or expired invite" }, { status: 403 });
    }

    // Check for existing username/email before attempting create
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: { username: true, email: true },
    });

    if (existingAdmin) {
      const field = existingAdmin.username === username ? "Username" : "Email";
      return Response.json(
        { success: false, error: `${field} is already in use` },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        canInvite: invite.canInvite,
      },
    });

    await prisma.adminInvite.update({
      where: { token },
      data: { used: true },
    });

    return Response.json(
      {
        success: true,
        message: "Admin signup successfully",
        admin: { id: admin.id, username: admin.username },
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Fallback: catches the rare race-condition case where two signups
    // with the same username/email slip past the check above at nearly the same time
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] ?? "field";
      return Response.json(
        { success: false, error: `${field} is already in use` },
        { status: 409 }
      );
    }

    console.log("Error signing-up admin: ", error.message);
    return Response.json(
      {
        success: false,
        error: "Error signing-up admin",
        details: error.message,
      },
      { status: 500 }
    );
  }
}