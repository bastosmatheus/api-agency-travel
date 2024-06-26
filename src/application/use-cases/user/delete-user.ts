import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { User } from "@/core/entities/user";

type DeleteUserRequest = {
  id: number;
};

class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  public async execute({ id }: DeleteUserRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const user = await this.userRepository.delete(id);

    return success(user);
  }
}

export { DeleteUser };
