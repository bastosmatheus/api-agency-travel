import { User } from "@/core/entities/user";
import { ConflictError } from "../errors/conflict-error";
import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";
import { HasherAndCompare } from "@/infra/cryptography/cryptography";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  cpf: string;
  telephone: string;
};

class CreateUser {
  constructor(private userRepository: UserRepository, private cryptography: HasherAndCompare) {}

  public async execute({
    name,
    email,
    password,
    cpf,
    telephone,
  }: CreateUserRequest): Promise<Either<ConflictError, User>> {
    const emailExists = await this.userRepository.findByEmail(email);

    if (emailExists) {
      return failure(new ConflictError(`Esse email já está em uso`));
    }

    const cpfExists = await this.userRepository.findByCpf(cpf);

    if (cpfExists) {
      return failure(new ConflictError(`Esse cpf já está em uso`));
    }

    const telephoneExists = await this.userRepository.findByTelephone(telephone);

    if (telephoneExists) {
      return failure(new ConflictError(`Esse telefone já está em uso`));
    }

    const passwordHashed = await this.cryptography.hash(password);

    const userCreated = User.create(name, email, passwordHashed, cpf, telephone);

    const user = await this.userRepository.create(userCreated);

    return success(user);
  }
}

export { CreateUser };
