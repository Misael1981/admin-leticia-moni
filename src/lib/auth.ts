import { prisma } from "@misael1981/physio-database"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Verifica se o email existe no banco
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      // Se não existe, nega o acesso
      if (!existingUser) return false

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // Busca o role do banco na primeira vez
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        token.role = dbUser?.role
        token.id = dbUser?.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
