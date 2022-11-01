import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCategories, useCompanies, usePages} from '../hooks';

interface Pages {
  attributes: {
    pages: string[];
  };
}

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
  const {data: pages} = usePages();
  const {data: categories} = useCategories();
  const pagesArray = pages?.data?.map((page: Pages) => page.attributes.pages);
  const flattenedPages = pagesArray?.flat();
  const industries = categories?.data?.map(
    (category: Category) => category?.attributes?.industry,
  );
  const industryCount = industries?.reduce(
    (acc: {[x: string]: number}, cat: string | number) => {
      acc[cat] = ++acc[cat] || 1;
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
        <h1 className="text-xl font-medium text-grey">{text}</h1>
      ) : (
        customHeading
      )}

      <div className="flex items-center gap-4 font-medium">
        <Link href="/categories">
          <a className={`tab ${categoriesTab}`}>
            {industryCount ? Object.keys(industryCount).length : null} {''}
            Categories
          </a>
        </Link>
        <Link href="/pages">
          <a className={`tab ${pagesTab}`}>{flattenedPages?.length} Pages</a>
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
