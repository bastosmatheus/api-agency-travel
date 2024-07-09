import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { FindUserByEmail } from "./find-user-by-email";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const findUserByEmail = new FindUserByEmail(userRepository);

  return {
    createUser,
    findUserByEmail,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find user by email", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find an user by email", async () => {
    const { createUser, findUserByEmail } = useCases;

    const userCreated = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (userCreated.isFailure()) return;

    const email = userCreated.value.email;

    const user = await findUserByEmail.execute({ email });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the user is not found", async () => {
    const { createUser, findUserByEmail } = useCases;

    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    const user = await findUserByEmail.execute({ email: "emailerrado@gmail.com" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
