export class AppError extends Error {
  constructor(message: string, code?: string) {
    super(message);
    this.name = code || this.name;
  }
}