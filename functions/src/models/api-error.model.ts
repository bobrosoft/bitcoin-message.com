export class ApiError extends Error {
  constructor(message: string, code?: string) {
    super(message);
    this.name = code;
  }
}