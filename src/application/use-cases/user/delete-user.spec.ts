import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { DeleteUser } from "./delete-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { CreateUser } from "./create-user";
import { NotFoundError } from "../errors/not-found-error";

let userRepository: InMemoryUserRepository;
let deleteUser: DeleteUser;
let createUser: CreateUser;
let cryptography: BcryptAdapter;

describe("delete an user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
    deleteUser = new DeleteUser(userRepository);
  });

  it("should be possible to delete an user by id", async () => {
    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id as number;

    const user = await deleteUser.execute({ id });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to delete if the user is not found", async () => {
    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await deleteUser.execute({ id: 12345678 });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
