import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateUser } from "./create-user";
import { UpdatePasswordUser } from "./update-password-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";

let userRepository: InMemoryUserRepository;
let createUser: CreateUser;
let updatePasswordUser: UpdatePasswordUser;
let cryptography: BcryptAdapter;

describe("update user password", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
    updatePasswordUser = new UpdatePasswordUser(userRepository, cryptography);
  });

  it("should be possible to update the user password", async () => {
    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id as number;

    const user = await updatePasswordUser.execute({ id, password: "senhanova" });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to update if the user is not found", async () => {
    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await updatePasswordUser.execute({ id: 1234567, password: "senhanova" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
