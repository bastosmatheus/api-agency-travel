import { User } from "@/core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "@/adapters/repositories/user-repository";
import { Either, failure, success } from "@/utils/either";

type FindUserByCpfRequest = {
  cpf: string;
};

class FindUserByCpf {
  constructor(private userRepository: UserRepository) {}

  public async execute({ cpf }: FindUserByCpfRequest): Promise<Either<NotFoundError, User>> {
    const user = await this.userRepository.findByCpf(cpf);

    if (!user) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o cpf: ${cpf}`));
    }

    return success(user);
  }
}

export { FindUserByCpf };
