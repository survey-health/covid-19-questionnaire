export const apiEndpoint = process.env.REACT_APP_API_ENDPOINT !== null ? process.env.REACT_APP_API_ENDPOINT : '';

export const apiFetch = async (url : string, init ? : RequestInit, jwt ?: string) : Promise<Response> => {
    if (!init) {
        init = {};
    }

    init.headers = init.headers instanceof Headers ? init.headers : new Headers();

    if (undefined !== jwt) {
        init.headers.append('Authorization', `Bearer ${jwt}`);
    }

    init.headers.append('Content-Type', 'application/json');

    return fetch(url, init);
};
