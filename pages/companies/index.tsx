import type {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import SubNav from '../../components/SubNav';

interface Company {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
}

const Companies: NextPage = () => {
  const {data: companies} = useCompanies();

  console.log(companies);

  return (
    <>
      <Head>
        <title>Companies</title>
      </Head>

      <SubNav text="Companies" />

      <section className="mt-8 grid grid-cols-5">
        {companies?.data?.map((company: Company) => (
          <Link
            key={company.id}
            href={`/companies/${company.attributes?.slug?.toLowerCase()}`}
          >
            <a className="px-10 py-4 text-md font-medium">
              {company.attributes.name}
            </a>
          </Link>
        ))}
      </section>
    </>
  );
};

export default Companies;

function useCompanies() {
  return useQuery(['companies'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies`)
      .then(res => res.data),
  );
}
