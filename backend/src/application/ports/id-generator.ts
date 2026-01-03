export interface IdGenerator {
    generate(): string;
    validate(id: string): boolean;
}
