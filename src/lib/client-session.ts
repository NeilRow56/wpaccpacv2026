import { useSession } from "./auth-client";

export function useUser() {
  const {
    data,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = useSession();

  return { data, isPending, error, refetch };
}
