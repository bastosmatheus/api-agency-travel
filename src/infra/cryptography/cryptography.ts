import bcrypt from "bcrypt";

interface HasherAndCompare {
  hash(plaintextPassword: string): Promise<string>;
  compare(password: string, plaintextPassword: string): void;
}

class BcryptAdapter implements HasherAndCompare {
  private readonly bcrypt: typeof bcrypt;

  constructor() {
    this.bcrypt = bcrypt;
  }

  public async hash(password: string): Promise<string> {
    const passwordHashed = await this.bcrypt.hash(password, 10);

    return passwordHashed;
  }

  public async compare(password: string, passwordHashed: string): Promise<boolean> {
    const isValid = await this.bcrypt.compare(password, passwordHashed);

    return isValid;
  }
}

export { BcryptAdapter, HasherAndCompare };
