import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { FindUserById } from "./find-user-by-id";

let userRepository: InMemoryUserRepository;
let findUserById: FindUserById;
let createUser: CreateUser;
let cryptography: BcryptAdapter;

describe("find user by id", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    findUserById = new FindUserById(userRepository);
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
  });

  it("should be possible to find an user by id", async () => {
    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id as number;

    const user = await findUserById.execute({ id });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the user is not found", async () => {
    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await findUserById.execute({ id: 1234567890 });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
