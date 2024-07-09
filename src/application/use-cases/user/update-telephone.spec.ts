import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UpdateTelephone } from "./update-telephone";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const updateTelephone = new UpdateTelephone(userRepository);

  return {
    createUser,
    updateTelephone,
  };
}

let useCases: ReturnType<typeof setup>;

describe("update user password", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to update the user telephone", async () => {
    const { createUser, updateTelephone } = useCases;

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
    const { createUser, updateTelephone } = useCases;

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
