import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { User } from "@/core/entities/user";

type UpdatePasswordUserRequest = {
  id: number;
  password: string;
};

class UpdatePasswordUser {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    id,
    password,
  }: UpdatePasswordUserRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const user = await this.userRepository.updatePasswordUser(id, password);

    return success(user);
  }
}

export { UpdatePasswordUser };
