import axios, { AxiosError } from "axios";

const baseURL =
    typeof window !== "undefined"
        ? window.laravel?.baseurl
        : "default_base_url";
const csrfToken =
    typeof window !== "undefined"
        ? window.laravel?.csrfToken
        : "default_csrf_token";

export const Axios = axios.create({
    baseURL,
    headers: {
        "X-CSRF-TOKEN": csrfToken,
        Accept: "application/json",
    },
});

Axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message: string }>) => {
        if (typeof window !== "undefined" && error.response?.status === 419) {
            return axios
                .get<{ csrfToken: string }>("/csrf-token")
                .then((response) => {
                    if (window.laravel) {
                        window.laravel.csrfToken = response.data.csrfToken;
                        if (error.config) {
                            error.config.headers = {
                                ...error.config.headers,
                                "X-CSRF-TOKEN": window.laravel.csrfToken,
                            } as any;
                            return Axios.request(error.config);
                        }
                    }
                    console.log("csrf token updated");
                })
                .catch((error) => Promise.reject(error));
        }
        return Promise.reject(error);
    },
);
