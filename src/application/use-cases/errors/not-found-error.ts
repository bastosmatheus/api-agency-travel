class NotFoundError extends Error {
  public readonly message: string;
  public readonly type = "Not Found";
  public readonly statusCode = 404;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { NotFoundError };
