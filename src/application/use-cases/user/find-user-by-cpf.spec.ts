import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { FindUserByCpf } from "./find-user-by-cpf";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const findUserByCpf = new FindUserByCpf(userRepository);

  return {
    createUser,
    findUserByCpf,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find user by cpf", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find an user by cpf", async () => {
    const { createUser, findUserByCpf } = useCases;

    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const cpf = userCreated.value.cpf;

    const user = await findUserByCpf.execute({ cpf });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the user is not found", async () => {
    const { createUser, findUserByCpf } = useCases;

    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await findUserByCpf.execute({ cpf: "00000000000" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
