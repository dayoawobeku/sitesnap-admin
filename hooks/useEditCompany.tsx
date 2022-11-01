import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

interface Slug {
  slug: string | string[] | undefined;
}

export function useEditCompany(id: Slug['slug']) {
  return useMutation((values: object) =>
    axios
      .put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies/${id}`, values)
      .then(res => res.data),
  );
}
