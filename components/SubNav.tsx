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
  const pageCount = pagesArray?.reduce(
    (acc: {[x: string]: number}, page: string | number) => {
      acc[page] = ++acc[page] || 1;
      return acc;
    },
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
            {industryCount && Object.keys(industryCount).length === 1 ? (
              <span>1 Category</span>
            ) : (
              <span>
                {industryCount && Object.keys(industryCount).length} Categories
              </span>
            )}
          </a>
        </Link>
        <Link href="/pages">
          <a className={`tab ${pagesTab}`}>
            {pageCount && Object.keys(pageCount).length === 1 ? (
              <span>1 Page</span>
            ) : (
              <span>{pageCount && Object.keys(pageCount).length} Pages</span>
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
