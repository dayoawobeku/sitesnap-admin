import {useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/router';

const Auth: NextPage = () => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDisabled(true);
    const result = await signIn('credentials', {
      redirect: false,
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    });
    if (result?.ok) {
      router.push('/');
      setDisabled(false);
      return;
    }
    alert('Credential is not valid');
    setDisabled(false);
  }
  return (
    <>
      <Head>
        <title>Admin Log in</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="m-auto max-w-[454px] px-4 pt-40 text-center">
        <p className="text-md font-medium text-blue">sitesnap.design</p>
        <h1 className="my-12 text-xl font-medium text-grey">Admin</h1>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            name="username"
            id="username"
            required
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            id="password"
            required
          />

          <button
            className="h-14 rounded-lg bg-blue font-medium text-white"
            disabled={disabled}
          >
            Log in
          </button>
        </form>
      </section>
    </>
  );
};

export default Auth;
