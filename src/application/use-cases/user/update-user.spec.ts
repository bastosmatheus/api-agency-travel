import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { CreateUser } from "./create-user";
import { UpdateUser } from "./update-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";

let userRepository: InMemoryUserRepository;
let createUser: CreateUser;
let updateUser: UpdateUser;
let cryptography: BcryptAdapter;

describe("update an user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
    updateUser = new UpdateUser(userRepository);
  });

  it("should be possible to update an user by id", async () => {
    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id as number;

    const user = await updateUser.execute({ id, name: "Lucas" });

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

    const user = await updateUser.execute({ id: 1234567890, name: "Lucas" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
