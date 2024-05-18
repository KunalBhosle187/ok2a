import Entra from "next-auth/providers/azure-ad";
import { getUserByEmail } from "./lib/quries";

const URL = process.env.URL;
export default {
  providers: [
    Entra({
      clientId: process.env.AUTH_AZURE_AD_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          db_access: token.db_access,
        },
      };
    },
    jwt: async ({ token, user }) => {
      // const res = await getUserByEmail(token.email);

      const res = await fetch(`${URL}/api/user/${token.email}`);
      if (!res.ok) return null;
      // if (!res) return null;

      const userDetails = await res.json();
      // const userDetails = res;
      console.log({ userDetails });

      if (!userDetails) return null;
      return {
        ...token,
        role: userDetails.role,
        db_access: userDetails.verified,
      };
    },
  },
  pages: {
    signIn: "/signin",
  },
};
