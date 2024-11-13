import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { LoginSchema } from "@/schema/auth";
import { eq } from "drizzle-orm";
import { comparePassword } from "@/lib/hashing";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user?.password) return null;
          const passwordsMatch = await comparePassword(user.password, password);

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        }

        return null;
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session?.user) {
        session.user.id = token.sub;
        session.user.name = token.name!;
        session.user.email = token.email!;
      }
      return session;
    },
    // async jwt({ token }) {
    //   if (!token.sub) return token;

    //   try {
    //     const existingUser = await getUserById(token.sub);
    //     if (!existingUser) return token;

    //     const existingAccount = await getAccountByUserId(existingUser.id);
    //     token.isOAuth = !!existingAccount;
    //     token.name = existingUser.name;
    //     token.email = existingUser.email;
    //     token.role = existingUser.role;
    //     token.organization = existingUser.organizationOwner;
    //   } catch (error) {
    //     console.error("JWT callback error:", error);
    //   }

    //   return token;
    // },
  },
} satisfies NextAuthConfig;
