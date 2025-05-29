import { navigateToLogin } from './navigation';

export const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await fetch(input, init);

    if (response.status === 401) {
        navigateToLogin();
    }

    return response;
};
