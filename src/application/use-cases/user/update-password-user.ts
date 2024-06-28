import { User } from "@/core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "@/adapters/repositories/user-repository";
import { HasherAndCompare } from "@/infra/cryptography/cryptography";
import { Either, failure, success } from "@/utils/either";

type UpdatePasswordUserRequest = {
  id: number;
  password: string;
};

class UpdatePasswordUser {
  constructor(private userRepository: UserRepository, private cryptography: HasherAndCompare) {}

  public async execute({
    id,
    password,
  }: UpdatePasswordUserRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const passwordHashed = await this.cryptography.hash(password);

    const user = await this.userRepository.updatePasswordUser(id, passwordHashed);

    return success(user);
  }
}

export { UpdatePasswordUser };
