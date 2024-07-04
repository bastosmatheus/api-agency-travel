import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UpdateTelephone } from "./update-telephone";

let userRepository: InMemoryUserRepository;
let createUser: CreateUser;
let updateTelephone: UpdateTelephone;
let cryptography: BcryptAdapter;

describe("update user password", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cryptography = new BcryptAdapter();
    createUser = new CreateUser(userRepository, cryptography);
    updateTelephone = new UpdateTelephone(userRepository);
  });

  it("should be possible to update the user telephone", async () => {
    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id as number;

    const user = await updateTelephone.execute({ id, telephone: "11988887777" });

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

    const user = await updateTelephone.execute({ id: 1234567, telephone: "11988887777" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
