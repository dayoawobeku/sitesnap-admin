import Link from 'next/link';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  text?: string;
  customHeading?: React.ReactNode;
}

interface Category {
  attributes: {
    industry: string;
  };
}

export default function SubNav({text, customHeading}: Props) {
  const {pathname} = useRouter();
  const {data: companies} = useCompanies();
  const {data: categories} = useCategories();
  const industries = categories?.data?.map(
    (category: Category) => category?.attributes?.industry,
  );
  const industryCount = industries?.reduce(
    (acc: {[x: string]: number}, curr: string | number) => {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }

      return acc;
    },
    {},
  );

  const categoriesTab = pathname === '/categories' ? 'tab-active' : '';
  const pagesTab = pathname === '/pages' ? 'tab-active' : '';
  const companiesTab = pathname === '/companies' ? 'tab-active' : '';

  return (
    <div className="flex items-center justify-between py-8">
      {text ? (
        <h1 className="text-grey text-xl font-medium">{text}</h1>
      ) : (
        customHeading
      )}

      <div className="flex items-center gap-4 font-medium">
        <Link href="/categories">
          <a className={`tab ${categoriesTab}`}>
            {industryCount && Object.keys(industryCount).length} Categories
          </a>
        </Link>
        <Link href="/pages">
          <a className={`tab ${pagesTab}`}>254 Pages</a>
        </Link>
        <Link href="/companies">
          <a className={`tab ${companiesTab}`}>
            {companies?.data.length} Companies
          </a>
        </Link>
      </div>
    </div>
  );
}

function useCompanies() {
  return useQuery(['companies'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies`)
      .then(res => res.data),
  );
}

function useCategories() {
  return useQuery(['categories'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?fields=industry`)
      .then(res => res.data),
  );
}
