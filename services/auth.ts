import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

interface UserCredentials {
  username: string;
  password: string;
}

export async function signIn({username, password}: UserCredentials) {
  const res = await axios.post(`${strapiUrl}/api/auth/local`, {
    identifier: username,
    password,
  });
  return res.data;
}
