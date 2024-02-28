import NextAuth from "next-auth";

import { authOptions } from "ayazmo-plugin-admin/server/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };