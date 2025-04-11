interface AuthCredentials {
    name: string;
    username: string;
    email: string;
    password: string;
}

// types.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in User type
   */
  interface User {
    id: string;
    name: string;
    username?: string;
    email: string;
    role: "USER" | "ADMIN";
    creditBalance?: number;
  }

  /**
   * Extends the built-in Session type
   */
  interface Session {
    user: {
      id: string;
      name: string;
      username?: string;
      email: string;
      role: "USER" | "ADMIN";
      creditBalance?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** 
   * Extends the built-in JWT type 
   */
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    creditBalance?: number;
  }
}