export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}
export class InfraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InfraError";
  }
}
