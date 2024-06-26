class BadRequestError extends Error {
  public readonly message: string;
  public readonly type = "Bad Request";
  public readonly statusCode = 400;

  constructor(message: string) {
    super(message);

    this.message = message;
  }
}

export { BadRequestError };
