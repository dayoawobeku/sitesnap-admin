import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {signOut} from 'next-auth/react';
import Fuse from 'fuse.js';
const _debounce = require('lodash.debounce');
import {search} from '../assets/images/images';
import {useCompanies} from '../hooks';
import Modal from './Modal';

interface Company {
  title: string;
  attributes: {
    name: string;
  };
  id: number;
}

interface Options {
  keys: string[];
  isCaseSensitive: boolean;
  includeScore: boolean;
  shouldSort: boolean;
  includeMatches: boolean;
  findAllMatches: boolean;
  minMatchCharLength: number;
  location: number;
  threshold: number;
  distance: number;
  useExtendedSearch: boolean;
  ignoreLocation: boolean;
  ignoreFieldNorm: boolean;
  fieldNormWeight: number;
  title: string;
}

const options: Fuse.IFuseOptions<Options> = {
  keys: ['title'],
  threshold: 0.3,
};

interface Props {
  children: React.ReactNode;
}

export default function Layout({children}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {data: companies} = useCompanies();
  const companyTitle = companies?.data?.map((company: Company) => {
    return {
      title: company?.attributes?.name,
    };
  });

  const [searchTerm, setSearchTerm] = useState('');

  const changeHandler = (e: {
    target: {value: React.SetStateAction<string>};
  }) => {
    setSearchTerm(e.target.value);
  };

  const fuse = new Fuse(companyTitle, options);
  const results = companyTitle ? fuse.search(searchTerm || '') : [];

  const debouncedChangeHandler = _debounce(changeHandler, 1000);

  return (
    <div className="mx-auto max-w-[1345px] px-4">
      <nav className="flex items-center justify-between py-8">
        <Link href="/">
          <a className="text-md font-medium text-blue">omoui.design</a>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          id="search-btn"
          className="flex h-13 w-full max-w-[648px] items-center justify-between rounded-lg bg-white-200 px-4 font-medium text-body"
        >
          <div className="flex items-center gap-2">
            <Image alt="" src={search} width={20} height={20} />
            <span>Search</span>
          </div>
        </button>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <label
            htmlFor="search"
            className="relative flex h-13 w-full max-w-[832px] items-center justify-between"
          >
            <div className="absolute left-4 h-5 w-5">
              <Image alt="" src={search} width={20} height={20} />
            </div>
            <input
              id="search"
              className="h-13 w-full max-w-[832px] pl-11 pr-4"
              placeholder="Search"
              onChange={debouncedChangeHandler}
            />
            {searchTerm !== '' && results.length > 0 ? (
              <div className="absolute top-[4.75rem] max-h-max w-full max-w-full rounded-lg bg-white-200 p-4 text-blue shadow-lg">
                {results?.map(result => (
                  <div key={result.item.title}>
                    <Link
                      href={`/companies/${result.item.title
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    >
                      <a
                        onClick={() => setIsOpen(false)}
                        className="flex rounded-md py-2 pl-4 transition-all hover:bg-blue hover:text-white"
                      >
                        {result.item.title}
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            ) : searchTerm !== '' && results.length === 0 ? (
              <div className="absolute top-[4.75rem] max-h-max w-full max-w-full rounded-lg bg-white-200 p-4 text-blue shadow-lg">
                <a className="flex py-1">No results</a>
              </div>
            ) : null}
          </label>
        </Modal>
        <button
          className="h-13 rounded-lg bg-blue px-4 font-medium text-white"
          onClick={() => signOut({callbackUrl: '/auth/signin'})}
        >
          Log out
        </button>
      </nav>

      {children}
    </div>
  );
}
