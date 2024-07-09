import { UserRepository } from "@/adapters/repositories/user-repository";
import { DatabaseConnection } from "../database/database-connection";
import { HttpServer } from "../http/http-server";
import {
  CreateUser,
  DeleteUser,
  FindUserByCpf,
  FindUserByEmail,
  FindUserById,
  FindUserByTelephone,
  FindUsers,
  LoginUser,
  UpdatePasswordUser,
  UpdateTelephone,
  UpdateUser,
} from "@/application/use-cases/user";
import { UserRepositoryDatabase } from "../repositories/user-repository-database";
import { HasherAndCompare } from "../cryptography/cryptography";
import { UserController } from "@/adapters/controllers/user-controller";
import { Token } from "../token/token";

class UserRoutes {
  private userRepository: UserRepository;

  constructor(
    private databaseConnection: DatabaseConnection,
    private httpServer: HttpServer,
    private cryptography: HasherAndCompare,
    private token: Token
  ) {
    this.userRepository = new UserRepositoryDatabase(this.databaseConnection);
  }

  public routes() {
    const findUsers = new FindUsers(this.userRepository);
    const findUserById = new FindUserById(this.userRepository);
    const findUserByEmail = new FindUserByEmail(this.userRepository);
    const findUserByCpf = new FindUserByCpf(this.userRepository);
    const findUserByTelephone = new FindUserByTelephone(this.userRepository);
    const createUser = new CreateUser(this.userRepository, this.cryptography);
    const loginUser = new LoginUser(this.userRepository, this.cryptography, this.token);
    const updateUser = new UpdateUser(this.userRepository);
    const updateUserTelephone = new UpdateTelephone(this.userRepository);
    const updatePasswordUser = new UpdatePasswordUser(this.userRepository, this.cryptography);
    const deleteUser = new DeleteUser(this.userRepository);

    return new UserController(
      this.httpServer,
      findUsers,
      findUserById,
      findUserByEmail,
      findUserByCpf,
      findUserByTelephone,
      createUser,
      loginUser,
      updateUser,
      updateUserTelephone,
      updatePasswordUser,
      deleteUser
    );
  }
}

export { UserRoutes };
