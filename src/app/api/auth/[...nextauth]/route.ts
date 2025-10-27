import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credantials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) return null;

        const isValidUser = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidUser) return null;

        return { id: user.id, email: user.email, hasProfile: user.hasProfile };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.hasProfile = (user as any).hasProfile;
      }
      // Handle session update (e.g., after profile setup)
      if (trigger === "update" && token.id) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { hasProfile: true },
        });
        if (updatedUser) {
          token.hasProfile = updatedUser.hasProfile;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.hasProfile !== undefined) {
        session.user.hasProfile = token.hasProfile as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
