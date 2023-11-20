import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { Toast, ToastOptions } from "react-native-toast-notifications";

import fetcher from "@/lib/Fetcher";

type UseFetchParams = {
  fetchOptions?: AxiosRequestConfig;
  pendingToast?: {
    message: string;
    options?: ToastOptions;
  };
  successToast?: {
    message: string;
    options?: ToastOptions;
  };
  failureToast?: {
    [statusCode: number]: {
      message: string;
      options?: ToastOptions;
    };
    fallback: {
      message: string;
      options?: ToastOptions;
    };
  };
  onError?: (statusCode: number, statusText: string, body: any) => void;
  onSuccess?: (statusCode: number, statusText: string, body: any) => void;
  onPending?: () => void;
};

export default function useFetch({
  fetchOptions,
  successToast,
  failureToast,
  pendingToast,
  onError,
  onSuccess,
  onPending,
}: UseFetchParams) {
  return {
    triggerFetch({
      failureToast: oFailureToast,
      fetchOptions: oFetchInit,
      successToast: oSuccessToast,
      pendingToast: oPendingToast,
      onError: oOnError,
      onSuccess: oOnSuccess,
      onPending: oOnPending,
    }: UseFetchParams): Promise<{ response?: AxiosResponse; body: any }> {
      oOnPending ? oOnPending() : onPending && onPending();
      let promiseToastId: string | null = null;
      const successToastObject = oSuccessToast ?? successToast;
      const pendingToastObject = oPendingToast ?? pendingToast;
      if (pendingToastObject && successToastObject) {
        promiseToastId = Toast.show(
          pendingToastObject.message,
          pendingToastObject.options ?? undefined
        );
      }

      return fetcher({
        ...fetchOptions,
        ...oFetchInit,
      })
        .then(response => {
          if (!response) {
            throw new Error("No response");
          }
          if (promiseToastId && successToastObject) {
            Toast.update(promiseToastId, successToastObject?.message, {
              ...(successToastObject?.options ?? {
                ...pendingToastObject?.options,
                type: "success",
                isLoading: false,
              }),
            });
          } else if (promiseToastId) {
            Toast.hide(promiseToastId);
          } else if (successToastObject) {
            Toast.show(successToastObject.message, {
              ...(successToastObject.options ?? {
                isLoading: false,
                type: "success",
              }),
            });
          }

          if (oOnSuccess || onSuccess) {
            oOnSuccess
              ? oOnSuccess(
                  response.status,
                  response.statusText,
                  response.data?.data
                )
              : onSuccess &&
                onSuccess(
                  response.status,
                  response.statusText,
                  response.data?.data
                );
          }

          return { response, body: response?.data };
        })
        .catch((error: AxiosError) => {
          const failureToastObject = oFailureToast ?? failureToast;
          if (promiseToastId && failureToastObject) {
            if (failureToastObject[error.response?.status ?? 0]) {
              Toast.update(
                promiseToastId,
                failureToastObject[error.response?.status ?? 500].message,
                {
                  ...(failureToastObject[error.response?.status ?? 500]
                    .options ?? {
                    ...pendingToastObject?.options,
                    type: "danger",
                    isLoading: false,
                  }),
                }
              );
            } else {
              Toast.update(
                promiseToastId,
                failureToastObject.fallback.message,
                {
                  ...(failureToastObject.fallback.options ?? {
                    type: "danger",
                    isLoading: false,
                  }),
                }
              );
            }
          }

          const response = error.response as unknown as {
            data: { message: string; data: any };
          };

          if (oOnError || onError) {
            onError
              ? onError(
                  error.response?.status ?? 500,
                  response ? response.data.message : error.message,
                  response ? response.data?.data : null
                )
              : oOnError &&
                oOnError(
                  error.response?.status ?? 500,
                  response ? response.data.message : error.message,
                  response ? response.data?.data : null
                );
          }

          return { response: error.response, body: response.data };
        });
    },
  };
}
