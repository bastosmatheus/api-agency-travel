import { CreateUser } from "./create-user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { FindUsers } from "./find-users";

function setup() {
  const userRepository = new InMemoryUserRepository();

  const cryptography = new BcryptAdapter();

  const createUser = new CreateUser(userRepository, cryptography);
  const findUsers = new FindUsers(userRepository);
  return {
    createUser,
    findUsers,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find users", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find all users", async () => {
    const { createUser, findUsers } = useCases;

    await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    await createUser.execute({
      name: "Matheus2",
      email: "matheus2@gmail.com",
      password: "12345678",
      cpf: "12345678911",
      telephone: "11977778889",
    });

    const users = await findUsers.execute();

    expect(users.length).toBeGreaterThanOrEqual(2);
  });
});
