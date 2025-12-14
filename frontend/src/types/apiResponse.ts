export interface ApiResponse<T, E = Record<string, string>> {
    message: string; // A message describing the result of the API call, e.g., "Success" or "Error"
    data: T; // Data can be null if there's no data to return
    fields: E; // Fields can be null if there are no errors
}
