import {signOut} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {search} from '../assets/images/images';

interface Props {
  children: React.ReactNode;
}

export default function Layout({children}: Props) {
  return (
    <div className="max-w-[1345px] mx-auto px-4">
      <nav className="py-8 flex items-center justify-between">
        <Link href="/">
          <a className="text-blue text-md font-medium">omoui.design</a>
        </Link>
        <button className="flex items-center justify-between text-body font-medium bg-white-200 rounded-lg px-4 h-13 w-full max-w-[648px]">
          <div className="flex items-center gap-2">
            <Image alt="" src={search} width={20} height={20} />
            <span>Search</span>
          </div>
        </button>
        <button
          className="bg-blue rounded-lg font-medium px-4 h-13 text-white"
          onClick={() => signOut({callbackUrl: '/auth/signin'})}
        >
          Log out
        </button>
      </nav>

      {children}
    </div>
  );
}
