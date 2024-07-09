import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateUser } from "./create-user";
import { UpdatePasswordUser } from "./update-password-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const updatePasswordUser = new UpdatePasswordUser(userRepository, cryptography);

  return {
    createUser,
    updatePasswordUser,
  };
}

let useCases: ReturnType<typeof setup>;

describe("update user password", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to update the user password", async () => {
    const { createUser, updatePasswordUser } = useCases;

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
    const { createUser, updatePasswordUser } = useCases;

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
