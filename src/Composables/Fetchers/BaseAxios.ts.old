import axios from "axios";

export const Axios = axios.create({
    baseURL: laravel.appurl,
    headers: {
        accept: "application/json",
    },
});

Axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            return axios
                .get("/csrf-token")

                .then((response) => {
                    laravel.csrfToken = response.data.csrfToken;
                    if (error.config) {
                        error.config.headers = {
                            ...error.config.headers,
                            "X-CSRF-TOKEN": laravel.csrfToken,
                        };
                        return Axios.request(error.config);
                    }
                    console.log("csrf token updated");
                })
                .catch((error) => Promise.reject(error));
        }
        return Promise.reject(error);
    },
);
