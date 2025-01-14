import { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import db from "./db";
import executeQuery from "./db";

const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        employee_id: {
          type: "employee_id",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials, req) {
        console.log("credentialscredentials", credentials);

        const { employee_id, password } = credentials;

        const sql = "select * from employees where id = ? and password = ?";
        const values = [employee_id, password];

        const [user] = await executeQuery(sql, values);

        console.log("useruser", user);

        // const user = {
        //   id: "1",
        //   name: "John",
        //   email: credentials?.email as string,
        // };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return {
            id: user.id,
            name: user.name,
            isAdmin: user.is_admin === 1, // 관리자 여부를 Boolean 값으로 변환
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // JWT에서 관리자 여부를 세션에 추가
      if (token) {
        session.user.isAdmin = token.isAdmin;
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // 사용자 정보가 있으면 관리자 여부를 토큰에 저장
      if (user) {
        token.isAdmin = user.isAdmin;
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/", //sigin page
  },
} satisfies NextAuthConfig;

export default authConfig;
