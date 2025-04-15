import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ref, watchEffect } from "vue";
import { deepFilter, deepModify } from "../../Utils/commonUtils";
import { Axios } from "./axios";

type ServerErrorType = {
  [key: string]: string[];
};

type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export function useApi<T = any>(
  setErrors?: (errors: Record<string, string>) => void,
) {
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const errors = ref<ServerErrorType>({});
  const isError = ref(false);
  const isSuccess = ref(false);
  const isRefetching = ref(false);
  const errorStatusCode = ref<number | null>(null);

  const callApiArgState = ref({
    route: "",
    method: "GET" as MethodType,
    payload: {},
    params: {},
  });

  let activeCallId = 0;

  if (setErrors) {
    watchEffect(() => {
      if (Object.keys(errors.value).length > 0) {
        const serverErrors: Record<string, string> = {};
        Object.keys(errors.value).forEach((key) => {
          serverErrors[key] = errors.value[key][0] || "";
        });
        setErrors(serverErrors);
      }
    });
  }

  const callApi = async (
    route: string,
    method: MethodType = "GET",
    payload: any = null,
    params: any = null,
    refetching: boolean = false
  ) => {
    const callId = ++activeCallId;

    callApiArgState.value = {
      route,
      method,
      payload,
      params,
    };

    if (!refetching) {
      isLoading.value = true;
    }

    error.value = null;
    errors.value = {};
    isError.value = false;
    isSuccess.value = false;

    let filteredPayload = deepModify(payload, (value) => {
      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }
    
      return value;
    });
    filteredPayload = deepFilter(filteredPayload, (value) => {
      return value !== null && value !== undefined;
    });
   

    try {
      const formDataPayload = new FormData();

      if (filteredPayload && method === "POST") {
        const appendPayload = (payload: any, parentKey?: string) => {
          if (Array.isArray(payload)) {
            payload.forEach((item, index) => {
              appendPayload(item, `${parentKey}[${index}]`);
            });
          } else if (
            typeof payload === "object" &&
            !(payload instanceof File) &&
            payload !== null
          ) {
            Object.keys(payload).forEach((k) => {
              appendPayload(payload[k], parentKey ? `${parentKey}[${k}]` : k);
            });
          } else {
            formDataPayload.append(parentKey || "payload", payload);
          }
        };
        appendPayload(filteredPayload);
      }

      const options: AxiosRequestConfig = {
        method,
        url: route,
        data: method === "POST" ? formDataPayload : filteredPayload,
        params: params,
      };

      const response: AxiosResponse = await Axios(options);

     
      if (callId === activeCallId) {
        data.value = response.data;
        isSuccess.value = true;
        if (response.data.route) {
          window.location.href = response.data.route;
        } else {
          isLoading.value = false;
        }
      }
      return response.data;
    } catch (err: any) {
      if (callId === activeCallId) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
        if (err.response?.data?.errors) {
          errors.value = err.response.data.errors;
        }
        if (err.response?.data?.message) {
          error.value = err.response.data.message;
        } else {
          error.value = "Failed to process request";
        }
        isError.value = true;
        isLoading.value = false;
        errorStatusCode.value = err.response?.status;
      }
    }
  };

  const refetch = async () => {
    isRefetching.value = true;
    await callApi(
      callApiArgState.value.route,
      callApiArgState.value.method,
      callApiArgState.value.payload,
      callApiArgState.value.params,
      true
    );
    isRefetching.value = false;
  };

  const reset = () => {
    data.value = null;
    isLoading.value = false;
    error.value = null;
    errors.value = {};
    isError.value = false;
    isSuccess.value = false;
  };

  return {
    callApi,
    refetch,
    reset,
    data,
    isRefetching,
    isLoading,
    error,
    errors,
    isError,
    isSuccess,
    errorStatusCode,
  };
}
