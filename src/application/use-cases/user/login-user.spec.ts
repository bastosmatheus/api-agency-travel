import { JwtAdapter } from "@/infra/token/token";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { LoginUser } from "./login-user";
import { CreateUser } from "./create-user";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { UnauthorizedError } from "../errors/unauthorized-error";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();
  const token = new JwtAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const loginUser = new LoginUser(userRepository, cryptography, token);

  return {
    createUser,
    loginUser,
  };
}

let useCases: ReturnType<typeof setup>;

describe("login with user", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to login", async () => {
    const { createUser, loginUser } = useCases;

    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await loginUser.execute({
      email: "matheus@gmail.com",
      password: "12345678",
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to login if the email is not found", async () => {
    const { createUser, loginUser } = useCases;

    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await loginUser.execute({
      email: "notfound@gmail.com",
      password: "12345678",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to login ff the password is incorrect", async () => {
    const { createUser, loginUser } = useCases;

    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await loginUser.execute({
      email: "matheus@gmail.com",
      password: "102030",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(UnauthorizedError);
  });
});
