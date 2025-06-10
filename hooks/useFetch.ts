"use client";

import { useEffect, useState, useRef } from "react";

interface Props<P> {
  url: string | null;
  options?: RequestInit;
  params?: P;
}

export function useFetch<T, P = void>({ url, options, params }: Props<P>) {
  const [data, setData] = useState<T | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!url || !isMounted) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const buildUrlWithParams = () => {
      if (!params) return url;

      const queryParts: string[] = [];
      Object.entries(params).forEach(([key, value]) => {
        queryParts.push(`${key}=${String(value)}`);
      });

      return queryParts.length > 0 ? `${url}?${queryParts.join("&")}` : url;
    };

    const fetchData = async () => {
      const isInitialLoad = data === null;

      setIsFetching(true);
      if (isInitialLoad) {
        setIsLoading(true);
      }
      setIsError(false);

      try {
        const fullUrl = buildUrlWithParams();
        const res = await fetch(fullUrl, {
          ...options,
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error(`Fetch error: ${res.status}`);
        }

        const jsonResponse = await res.json();

        if (!abortController.signal.aborted) {
          setData(jsonResponse);
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError" &&
          !abortController.signal.aborted
        ) {
          console.error(err);
          setIsError(true);
          // Only clear data on initial load error
          if (isInitialLoad) {
            setData(null);
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsFetching(false);
          if (isInitialLoad) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, options, params, isMounted]);

  return { data, isError, isLoading, isFetching };
}
