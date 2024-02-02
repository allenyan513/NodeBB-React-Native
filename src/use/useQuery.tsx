import {useEffect, useState} from 'react';
import {AxiosResponse} from 'axios';

interface QueryProps {
  queryKey: string;
  // queryFn: Promise<any>;
  queryFn: () => Promise<AxiosResponse<any, any>>;
}

export default function useQuery<T>(props: QueryProps) {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>(null);

  // useEffect(() => {
  //   query();
  // }, []);

  const query = async () => {
    setIsPending(true);
    try {
      const response = await props.queryFn();
      if (response.status !== 200) {
        throw new Error('status code is not 200');
      }
      if (response.data.code !== 200) {
        throw new Error('business code is not 200');
      }
      setData(response.data.data as T);
    } catch (e) {
      setError(e);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };
  return {
    isPending,
    isError,
    data,
    setData,
    error,
    query,
  };
}
