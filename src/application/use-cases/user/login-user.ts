import { UserRepository } from "@/adapters/repositories/user-repository";
import { Token } from "@/infra/token/token";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "@/infra/cryptography/cryptography";
import { UnauthorizedError } from "../errors/unauthorized-error";

type LoginUserRequest = {
  email: string;
  password: string;
};

class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private compare: HasherAndCompare,
    private token: Token
  ) {}

  public async execute({
    email,
    password,
  }: LoginUserRequest): Promise<Either<NotFoundError | UnauthorizedError, string>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return failure(new NotFoundError(`Email incorreto`));
    }

    const checkPassword = await this.compare.compare(password, user.password);

    if (!checkPassword) {
      return failure(new UnauthorizedError(`Senha incorreta`));
    }

    const token = await this.token.sign({
      id: user.id as number,
      is_admin: user.is_admin,
      email: user.email,
    });

    return success(token);
  }
}

export { LoginUser };
