import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { ConflictError } from "../errors/conflict-error";

let userRepository: InMemoryUserRepository;
let createUser: CreateUser;
let cryptography: BcryptAdapter;

describe("create a new user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
  });

  it("should be possible to create an user", async () => {
    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to create an user if the email already exists", async () => {
    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(ConflictError);
  });

  it("should not be possible to create an user if the cpf already exists", async () => {
    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus2@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(ConflictError);
  });

  it("should not be possible to create an user if the telephone already exists", async () => {
    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus2@gmail.com",
      password: "12345678",
      cpf: "12345678911",
      telephone: "11977778888",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(ConflictError);
  });
});
