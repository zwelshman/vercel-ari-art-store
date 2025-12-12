import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions["adapter"],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo purposes, we'll use a simple check
        // In production, you'd verify against hashed passwords
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | null;
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.creditsRemaining = token.creditsRemaining as number;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            subscriptionTier: true,
            creditsRemaining: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.subscriptionTier = dbUser.subscriptionTier;
          token.creditsRemaining = dbUser.creditsRemaining;
        }
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.picture = session.image;
        token.creditsRemaining = session.creditsRemaining;
      }

      return token;
    },
  },
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}
