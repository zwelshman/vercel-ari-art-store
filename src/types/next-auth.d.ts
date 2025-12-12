import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscriptionTier: string;
      creditsRemaining: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    subscriptionTier?: string;
    creditsRemaining?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    subscriptionTier?: string;
    creditsRemaining?: number;
  }
}
