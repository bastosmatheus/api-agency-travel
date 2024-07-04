import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { FindUserByTelephone } from "./find-user-by-telephone";

let userRepository: InMemoryUserRepository;
let findUserByTelephone: FindUserByTelephone;
let createUser: CreateUser;
let cryptography: BcryptAdapter;

describe("find user by telephone", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    findUserByTelephone = new FindUserByTelephone(userRepository);
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
  });

  it("should be possible to find an user by telephone", async () => {
    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const telephone = userCreated.value.telephone;

    const user = await findUserByTelephone.execute({ telephone });

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

    const user = await findUserByTelephone.execute({ telephone: "11988887777" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
