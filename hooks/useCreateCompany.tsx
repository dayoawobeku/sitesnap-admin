import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: object) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies`, values)
        .then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies']);
      },
    },
  );
}
