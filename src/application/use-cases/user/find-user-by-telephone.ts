import { User } from "@/core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";

type FindUserByTelephoneRequest = {
  telephone: string;
};

class FindUserByTelephone {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    telephone,
  }: FindUserByTelephoneRequest): Promise<Either<NotFoundError, User>> {
    const user = await this.userRepository.findByTelephone(telephone);

    if (!user) {
      return failure(
        new NotFoundError(`Nenhum usuário encontrado com o número de telefone: ${telephone}`)
      );
    }

    return success(user);
  }
}

export { FindUserByTelephone };
