import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "../../../../db/client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'text'},
        password: { label: 'Password', type: 'password'}
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const admin = await prisma.admin.findFirst({
            where: {
              OR: [
                {email: credentials.identifier},
                {username: credentials.identifier},
              ]
            }
          })
          if (!admin) {
            throw new Error('No admin found with this email or username')
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, admin.password)
          if (isPasswordCorrect) {
            return admin
          } else {
            throw new Error('Incorrect Password')
          }
        } catch (error: any) {
          throw new Error(error)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
        token.id = user.id?.toString();
        token.username = user.username
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username
      }

      return session
    }
  },
  pages: {
    signIn: '/admin/sign-in'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}