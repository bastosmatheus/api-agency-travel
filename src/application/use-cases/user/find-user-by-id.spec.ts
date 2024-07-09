import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { FindUserById } from "./find-user-by-id";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const findUserById = new FindUserById(userRepository);

  return {
    createUser,
    findUserById,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find user by id", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find an user by id", async () => {
    const { createUser, findUserById } = useCases;

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
    const { createUser, findUserById } = useCases;

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
