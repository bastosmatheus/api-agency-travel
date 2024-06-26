import { User } from "@/core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";

type UpdateUserRequest = {
  id: number;
  name: string;
};

class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  public async execute({ id, name }: UpdateUserRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const user = await this.userRepository.update(id, name);

    return success(user);
  }
}

export { UpdateUser };
