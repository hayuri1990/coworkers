import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IUser } from '@/types/user';

//user 정보 가져오기
//TODO: 어떤 정보를 받아왔을 때 ex.id , user 정보를 가져올 수 있는가 ?

export default function useUser(id?: number) {
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getUser'],
    queryFn: () => {
      if (id) {
        return authAxiosInstance
          .get(`/user`)
          .then((res) => res.data)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.error('Failed to fetch memberlist:', err);
            throw err;
          });
      } else {
        return [];
      }
    },
    enabled: !!id,
  });
  return { userData, isLoading, error };
}
