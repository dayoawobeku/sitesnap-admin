// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Session, User} from 'next-auth';

declare module 'next-auth' {
  interface Session {
    id: number | unknown;
    jwt: string | unknown;
  }
}

declare module 'next-auth' {
  interface User {
    jwt: string | unknown;
  }
}
