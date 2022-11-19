import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCategories, useCompanies, usePages} from '../hooks';

interface Pages {
  attributes: {
    pages: string[];
  };
  page_name: string;
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
  const industries = categories?.data?.map(
    (category: Category) => category?.attributes?.industry,
  );
  const allIndustries = industries?.reduce(
    (acc: {[x: string]: number}, cat: string | number) => {
      acc[cat] = ++acc[cat] || 1;
      return acc;
    },
    {},
  );
  const industryCount = allIndustries && Object.keys(allIndustries).length;

  const pagesArray = pages?.data?.map((page: Pages) => page.attributes.pages);
  const flattenedPages = pagesArray?.flat();
  const pagesCount = flattenedPages?.map((page: Pages) => page.page_name);
  const allPages = pagesCount?.reduce(
    (acc: {[x: string]: number}, page: string | number) => {
      acc[page] = ++acc[page] || 1;
      return acc;
    },
    {},
  );
  const pageCount = allPages && Object.keys(allPages).length;

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
            {industryCount === 1 ? (
              <span>1 Category</span>
            ) : (
              <span>{industryCount} Categories</span>
            )}
          </a>
        </Link>
        <Link href="/pages">
          <a className={`tab ${pagesTab}`}>
            {pageCount === 1 ? (
              <span>1 Page</span>
            ) : (
              <span>{pageCount} Pages</span>
            )}
          </a>
        </Link>
        <Link href="/companies">
          <a className={`tab ${companiesTab}`}>
            {companies?.data?.length === 1 ? (
              <span>1 Company</span>
            ) : (
              <span>{companies?.data?.length} Companies</span>
            )}
          </a>
        </Link>
      </div>
    </div>
  );
}
