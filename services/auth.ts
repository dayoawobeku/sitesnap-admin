import axios from 'axios';

interface UserCredentials {
  username: string;
  password: string;
}

export async function signIn({username, password}: UserCredentials) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
    {
      identifier: username,
      password,
    },
  );
  return res.data;
}
