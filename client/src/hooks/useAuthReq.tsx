import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

export function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export const useIsAdmin = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role === "admin";
};
