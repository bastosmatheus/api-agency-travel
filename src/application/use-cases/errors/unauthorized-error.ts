class UnauthorizedError extends Error {
  public readonly message: string;
  public readonly type = "Unauthorized";
  public readonly statusCode = 401;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { UnauthorizedError };
