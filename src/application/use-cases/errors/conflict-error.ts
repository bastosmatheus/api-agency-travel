class ConflictError extends Error {
  public readonly message: string;
  public readonly type = "Conflict";
  public readonly statusCode = 409;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { ConflictError };
