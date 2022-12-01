import NextAuth, {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {signIn} from '../../../services/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Sign in with Username and Password',
      credentials: {
        username: {label: 'Username', type: 'text'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        try {
          const {user, jwt} = await signIn({
            username: credentials.username,
            password: credentials.password,
          });
          return {...user, jwt};
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session({session, token}) {
      session.id = token.id;
      session.jwt = token.jwt;
      return Promise.resolve(session);
    },
    jwt({token, user}) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.id = user?.id;
        token.jwt = user?.jwt;
      }
      return Promise.resolve(token);
    },
  },
  session: {
    strategy: 'jwt',
    // maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
