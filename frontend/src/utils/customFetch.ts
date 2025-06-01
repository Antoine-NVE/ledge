import { refresh } from '../api/auth';
import { navigateToLogin } from './navigation';

export const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
    retryOn401: boolean = true
): Promise<Response> => {
    const response = await fetch(input, init);

    if (response.status === 401 && retryOn401) {
        const [, refreshResponse] = await refresh();

        if (refreshResponse && refreshResponse.status !== 401) {
            return await fetch(input, init);
        }

        navigateToLogin();
    }

    return response;
};
