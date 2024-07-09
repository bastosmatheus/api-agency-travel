import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { CreateUser } from "./create-user";
import { UpdateUser } from "./update-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const updateUser = new UpdateUser(userRepository);

  return {
    createUser,
    updateUser,
  };
}

let useCases: ReturnType<typeof setup>;

describe("update an user", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to update an user by id", async () => {
    const { createUser, updateUser } = useCases;

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
    const { createUser, updateUser } = useCases;

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
