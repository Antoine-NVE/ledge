import { navigateToLogin } from './navigation';

export const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
    handle401: boolean = true
): Promise<Response> => {
    const response = await fetch(input, init);

    if (handle401 && response.status === 401) {
        navigateToLogin();
    }

    return response;
};
