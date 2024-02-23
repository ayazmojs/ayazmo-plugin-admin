import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { URL } from "url";

const apiUrl = new URL(process.env.API_URL ?? '');

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) { //(2) 
      console.log("------------ JWT ------------");
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId; // this is Id that coming from authorize() callback 
      }
      return token;
    },
    async session({ session, token, user }) { //(3)
      console.log("------------ SESSION ------------");
      if (session && session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', //(4) custom signin page path
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string
          password: string
        };
        try {
          const response = await fetch(new URL('/admin/login', apiUrl), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });

          if (!response.ok) {
            return null;
          }

          const { admin } = await response.json();
          return admin;
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          return null;
        }
      }
    })
  ],
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'development' ? `next-auth.session-token` : `__Secure-next-auth.session-token`, // Make sure to add conditional logic so that the name of the cookie does not include `__Secure-` on localhost
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        domain: apiUrl.hostname
      }
    },
  }
};

export const getServerAuthSession = () => getServerSession(authOptions); //(6)