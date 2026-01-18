export interface IdManager {
    generate(): string;
    validate(id: string): boolean;
}
