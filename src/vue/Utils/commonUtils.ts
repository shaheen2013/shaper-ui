export const addParamsToUrl = (
    urlString: string,
    additionalParams: Record<string, string> = {},
    priorityParams: Record<string, string> = {},
): string => {
    const url = new URL(urlString);

    const existingParams = Array.from(url.searchParams.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {},
    );
    const mergedParams = {
        ...existingParams,
        ...additionalParams,
        ...priorityParams,
    };

    url.search = new URLSearchParams(mergedParams).toString();

    return url.toString();
};

export const getCurrentUrlParams = (): Record<string, string> => {
    const currentUrl = window.location.href;
    return Array.from(new URL(currentUrl).searchParams.entries()).reduce(
        (params, [key, value]) => ({ ...params, [key]: value }),
        {},
    );
};

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function deepModify<T>(
    obj: T,
    modifierFn: (value: any, key?: string | number) => any,
): T {
    if (Array.isArray(obj)) {
        return obj.map((item) => deepModify(item, modifierFn)) as unknown as T;
    } else if (obj instanceof File) {
        return obj;
    } else if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                deepModify(value, modifierFn),
            ]),
        ) as T;
    } else {
        return modifierFn(obj) as T;
    }
}
export function deepFilter<T>(
    obj: T,
    filterFn: (value: any, key?: string | number) => boolean,
): T | undefined {
    if (Array.isArray(obj)) {
        const filteredArray = obj
            .map((item) => deepFilter(item, filterFn))
            .filter((item) => item !== undefined);
        return filteredArray.length > 0
            ? (filteredArray as unknown as T)
            : ([] as T);
    } else if (obj instanceof File) {
        return filterFn(obj) ? obj : undefined;
    } else if (obj !== null && typeof obj === "object") {
        const filteredObject = Object.fromEntries(
            Object.entries(obj)
                .map(([key, value]) => {
                    const filteredValue = deepFilter(value, filterFn);
                    return filterFn(value, key) ||
                        (filteredValue &&
                            typeof filteredValue === "object" &&
                            Object.keys(filteredValue).length > 0)
                        ? [key, filteredValue]
                        : undefined;
                })
                .filter((entry) => entry !== undefined),
        );
        return Object.keys(filteredObject).length > 0
            ? (filteredObject as T)
            : ({} as T);
    } else {
        return filterFn(obj) ? obj : undefined;
    }
}
