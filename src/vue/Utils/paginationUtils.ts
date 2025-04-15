/**-- Utils --*/
// Distruct table metadata from query params
export const addAllParamsToUrl = (url: URL) => {
    const currentUrl = new URL(window.location.href);

    url.searchParams.forEach((value, key) => {
        currentUrl.searchParams.set(key, value);
    });

    window.history.replaceState({}, "", currentUrl.toString());
};
// Set query
// Return table meta data
export const setPaginationQueryData = (key: string, value: string, sort?: boolean) => {
    const url = new URL(window.location.href);
    let sort_direction = url.searchParams.get("sort_direction");
    if (sort) {
        if (sort_direction === "desc") {
            sort_direction = "asc";
        } else {
            sort_direction = "desc";
        }
    }
    url.searchParams.set("sort_direction", sort_direction || "desc");
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url.toString());
    return true;
};

export const setQueryParams = (key: string, value: string): object => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url.toString());
    return { [key]: value };
};

export const getQueryParams = (key: string) => {
    if (window) {
        const search = new URLSearchParams(window.location.search)
        return search.get(key)
    }
    return "not-ready"
}