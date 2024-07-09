import { z } from "zod";
import { User } from "@/core/entities/user";
import { HttpServer } from "@/infra/http/http-server";
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
import { AdminMiddleware } from "@/infra/middlewares/admin-middleware";
import { AuthMiddleware } from "@/infra/middlewares/auth-middleware";

class UserController {
  constructor(
    private httpServer: HttpServer,
    private findUsers: FindUsers,
    private findUserById: FindUserById,
    private findUserByEmail: FindUserByEmail,
    private findUserByCpf: FindUserByCpf,
    private findUserByTelephone: FindUserByTelephone,
    private createUser: CreateUser,
    private loginUser: LoginUser,
    private updateUser: UpdateUser,
    private updateTelephone: UpdateTelephone,
    private updatePasswordUser: UpdatePasswordUser,
    private deleteUser: DeleteUser
  ) {
    this.httpServer.on("get", [], "/users", async () => {
      const users = await this.findUsers.execute();

      return {
        type: "OK",
        statusCode: 200,
        users,
      };
    });

    this.httpServer.on(
      "get",
      [AdminMiddleware.verifyToken],
      "/users/email",
      async (params: unknown, body: unknown, query: { email: string }) => {
        const findByEmailSchema = z.object({
          email: z
            .string({
              invalid_type_error: "O email deve ser uma string",
              required_error: "Informe o email em uma query string",
            })
            .email({ message: "Informe um email válido" }),
        });

        const { email } = query;
        findByEmailSchema.parse({ email });

        const user = await this.findUserByEmail.execute({ email });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on(
      "get",
      [AdminMiddleware.verifyToken],
      "/users/cpf",
      async (params: unknown, body: unknown, query: { cpf: string }) => {
        const findByCpfSchema = z.object({
          cpf: z
            .string({
              invalid_type_error: "O cpf deve ser uma string",
              required_error: "Informe o cpf em uma query string",
            })
            .length(11, { message: "O cpf deve ter 11 dígitos" }),
        });

        const { cpf } = query;
        findByCpfSchema.parse({ cpf });

        const user = await this.findUserByCpf.execute({ cpf });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on(
      "get",
      [AdminMiddleware.verifyToken],
      "/users/telephone",
      async (params: unknown, body: unknown, query: { telephone: string }) => {
        const findByTelephoneSchema = z.object({
          telephone: z
            .string({
              invalid_type_error: "O telefone deve ser uma string",
              required_error: "Informe o telefone em uma query string",
            })
            .length(11, { message: "O telefone deve ter 11 dígitos" }),
        });

        const { telephone } = query;
        findByTelephoneSchema.parse({ telephone });

        const user = await this.findUserByTelephone.execute({ telephone });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on(
      "get",
      [AuthMiddleware.verifyToken],
      "/users/:id",
      async (params: { id: string }, body: unknown) => {
        const findByIdSchema = z.object({
          id: z
            .number({
              invalid_type_error: "O ID deve ser um número",
              required_error: "Informe o ID",
            })
            .min(1, { message: "Informe um ID válido" }),
        });

        const { id } = params;
        findByIdSchema.parse({ id: Number(id) });

        const user = await this.findUserById.execute({ id: Number(id) });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on("post", [], "/users", async (params: unknown, body: User) => {
      const createSchema = z.object({
        name: z
          .string({
            invalid_type_error: "O nome deve ser uma string",
            required_error: "Informe o nome",
          })
          .min(2, { message: "O nome deve conter no minimo 2 caracteres" }),
        email: z
          .string({
            invalid_type_error: "O email deve ser uma string",
            required_error: "Informe o email",
          })
          .email({ message: "Informe um email válido" }),
        password: z
          .string({
            invalid_type_error: "A senha deve ser uma string",
            required_error: "Informe a senha",
          })
          .min(6, { message: "A senha deve conter no minimo 6 caracteres" }),
        cpf: z
          .string({
            invalid_type_error: "O cpf deve ser uma string",
            required_error: "Informe o cpf",
          })
          .length(11, { message: "O cpf deve ter 11 dígitos" }),
        telephone: z
          .string({
            invalid_type_error: "O telefone deve ser uma string",
            required_error: "Informe o telefone",
          })
          .length(11, { message: "O telefone deve ter 11 dígitos" }),
      });

      const { name, email, password, cpf, telephone } = body;
      createSchema.parse({ name, email, password, cpf, telephone });

      const user = await this.createUser.execute({ name, email, password, cpf, telephone });

      if (user.isFailure()) {
        return {
          type: user.value.type,
          statusCode: user.value.statusCode,
          message: user.value.message,
        };
      }

      return {
        message: "Usuário criado",
        type: "Created",
        statusCode: 201,
        user: {
          ...user.value,
        },
      };
    });

    this.httpServer.on("post", [], "/users/login", async (params: unknown, body: User) => {
      const createSchema = z.object({
        email: z
          .string({
            invalid_type_error: "O email deve ser uma string",
            required_error: "Informe o email",
          })
          .email({ message: "Informe um email válido" }),
        password: z.string({
          invalid_type_error: "A senha deve ser uma string",
          required_error: "Informe a senha",
        }),
      });

      const { email, password } = body;
      createSchema.parse({ email, password });

      const token = await this.loginUser.execute({ email, password });

      if (token.isFailure()) {
        return {
          type: token.value.type,
          statusCode: token.value.statusCode,
          message: token.value.message,
        };
      }

      return {
        message: "Usuário logado",
        type: "OK",
        statusCode: 200,
        token: token.value,
      };
    });

    this.httpServer.on(
      "patch",
      [AuthMiddleware.verifyToken],
      "/users/:id/name",
      async (params: { id: string }, body: User) => {
        const updateNameSchema = z.object({
          id: z
            .number({
              invalid_type_error: "O ID deve ser um número",
              required_error: "Informe o ID",
            })
            .min(1, { message: "Informe um ID válido" }),
          name: z
            .string({
              invalid_type_error: "O nome deve ser uma string",
              required_error: "Informe o nome",
            })
            .min(2, { message: "O nome deve conter no minimo 2 caracteres" }),
        });

        const { id } = params;
        const { name } = body;
        updateNameSchema.parse({ id: Number(id), name });

        const user = await this.updateUser.execute({ id: Number(id), name });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          message: "Usuário atualizado",
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on(
      "patch",
      [AuthMiddleware.verifyToken],
      "/users/:id/telephone",
      async (params: { id: string }, body: User) => {
        const updateTelephoneSchema = z.object({
          id: z
            .number({
              invalid_type_error: "O ID deve ser um número",
              required_error: "Informe o ID",
            })
            .min(1, { message: "Informe um ID válido" }),
          telephone: z
            .string({
              invalid_type_error: "O telefone deve ser uma string",
              required_error: "Informe o telefone",
            })
            .length(11, { message: "O telefone deve ter 11 dígitos" }),
        });

        const { id } = params;
        const { telephone } = body;
        updateTelephoneSchema.parse({ id: Number(id), telephone });

        const user = await this.updateTelephone.execute({ id: Number(id), telephone });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          message: "Telefone atualizado",
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on(
      "patch",
      [AuthMiddleware.verifyToken],
      "/users/:id/password",
      async (params: { id: string }, body: User) => {
        const updatePasswordSchema = z.object({
          id: z
            .number({
              invalid_type_error: "O ID deve ser um número",
              required_error: "Informe o ID",
            })
            .min(1, { message: "Informe um ID válido" }),
          password: z
            .string({
              invalid_type_error: "A senha deve ser uma string",
              required_error: "Informe a senha",
            })
            .min(6, { message: "A senha deve conter no minimo 6 caracteres" }),
        });

        const { id } = params;
        const { password } = body;
        updatePasswordSchema.parse({ id: Number(id), password });

        const user = await this.updatePasswordUser.execute({ id: Number(id), password });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          message: "Senha atualizada",
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on(
      "delete",
      [AuthMiddleware.verifyToken],
      "/users/:id",
      async (params: { id: string }, body: unknown) => {
        const deleteSchema = z.object({
          id: z
            .number({
              invalid_type_error: "O ID deve ser um número",
              required_error: "Informe o ID",
            })
            .min(1, { message: "Informe um ID válido" }),
        });

        const { id } = params;
        deleteSchema.parse({ id: Number(id) });

        const user = await this.deleteUser.execute({ id: Number(id) });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          message: "Usuário excluido",
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );
  }
}

export { UserController };
