import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";
import { User } from "@/core/entities/user";

type UpdateTelephoneRequest = {
  id: number;
  telephone: string;
};

class UpdateTelephone {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    id,
    telephone,
  }: UpdateTelephoneRequest): Promise<Either<NotFoundError | ConflictError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const telephoneExists = await this.userRepository.findByTelephone(telephone);

    if (telephoneExists && userExists.telephone !== telephoneExists.telephone) {
      return failure(new ConflictError(`Esse número de telefone já está em uso`));
    }

    const user = await this.userRepository.updateTelephone(id, telephone);

    return success(user);
  }
}

export { UpdateTelephone };
