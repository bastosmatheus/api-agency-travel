import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { DeleteUser } from "./delete-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { CreateUser } from "./create-user";
import { NotFoundError } from "../errors/not-found-error";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const deleteUser = new DeleteUser(userRepository);

  return {
    createUser,
    deleteUser,
  };
}

let useCases: ReturnType<typeof setup>;

describe("delete an user", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to delete an user by id", async () => {
    const { createUser, deleteUser } = useCases;
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
    const { createUser, deleteUser } = useCases;

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
