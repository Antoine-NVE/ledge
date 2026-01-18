export interface Hasher {
    hash: (value: string) => Promise<string>;
    compare: (raw: string, hash: string) => Promise<boolean>;
}
