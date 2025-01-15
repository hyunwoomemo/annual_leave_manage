import { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import db from "./db";
import executeQuery from "./db";
import { CredentialsSignin } from "next-auth";

const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        employee_num: {
          type: "employee_num",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { employee_num, password } = credentials;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: "POST",
          body: JSON.stringify({ employee_num, password }),
        });

        const data = await res.json();

        // console.log("authorizeauthorize", res.ok, data);
        console.log("authorizeauthorize", res.ok, res.status, res.statusText);

        // const user = {
        //   id: "1",
        //   name: "John",
        //   email: credentials?.email as string,
        // };
        if (res.ok) {
          // const user = {
          //   id: "1",
          //   name: "John",
          //   email: credentials?.email as string,
          // };
          // return data.data;
          return {
            id: data.data.id,
            name: data.data.name,
            isAdmin: data.data.is_admin === 1, // 관리자 여부
            employee_num: data.data.employee_num,
          };
        } else {
          const credentialsSignin = new CredentialsSignin();
          // new CredentialsSignin(data.message);
          if (res.status === 404) {
            credentialsSignin.code = "no_user";
          } else if (res.status === 401) {
            credentialsSignin.code = "wrong_password";
          }
          throw credentialsSignin;
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
        session.user.employee_num = token.employee_num;
      }
      return session;
    },
    async jwt({ token, user }) {
      // 사용자 정보가 있으면 관리자 여부를 토큰에 저장
      if (user) {
        token.isAdmin = user.isAdmin;
        token.id = user.id;
        token.employee_num = user.employee_num;
      }
      return token;
    },
  },
  pages: {
    signIn: "/", //sigin page
  },
} satisfies NextAuthConfig;

export default authConfig;
