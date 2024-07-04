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
  UpdatePasswordUser,
  UpdateTelephone,
  UpdateUser,
} from "@/application/use-cases/user";

class UserController {
  constructor(
    private httpServer: HttpServer,
    private findUsers: FindUsers,
    private findUserById: FindUserById,
    private findUserByEmail: FindUserByEmail,
    private findUserByCpf: FindUserByCpf,
    private findUserByTelephone: FindUserByTelephone,
    private createUser: CreateUser,
    private updateUser: UpdateUser,
    private updateTelephone: UpdateTelephone,
    private updatePasswordUser: UpdatePasswordUser,
    private deleteUser: DeleteUser
  ) {
    this.httpServer.on("get", "/users", async () => {
      const users = await this.findUsers.execute();

      return {
        type: "OK",
        statusCode: 200,
        users,
      };
    });

    this.httpServer.on("get", "/users/:id", async (params: { id: number }, body: unknown) => {
      const findByIdSchema = z.object({
        id: z
          .number({
            invalid_type_error: "O ID deve ser um número",
            required_error: "Informe o ID",
          })
          .min(1, { message: "Informe um ID válido" }),
      });

      const { id } = params;
      findByIdSchema.parse({ id });

      const user = await this.findUserById.execute({ id });

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
    });

    this.httpServer.on(
      "get",
      "/users/email/:email",
      async (params: { email: string }, body: unknown) => {
        const findByEmailSchema = z.object({
          email: z
            .string({
              invalid_type_error: "O email deve ser uma string",
              required_error: "Informe o email",
            })
            .email({ message: "Informe um email válido" }),
        });

        const { email } = params;
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

    this.httpServer.on("get", "/users/cpf/:cpf", async (params: { cpf: string }, body: unknown) => {
      const findByCpfSchema = z.object({
        cpf: z
          .string({
            invalid_type_error: "O cpf deve ser uma string",
            required_error: "Informe o cpf",
          })
          .length(11, { message: "O cpf deve ter 11 dígitos" }),
      });

      const { cpf } = params;
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
    });

    this.httpServer.on(
      "get",
      "/users/telephone/:telephone",
      async (params: { telephone: string }, body: unknown) => {
        const findByTelephoneSchema = z.object({
          telephone: z
            .string({
              invalid_type_error: "O telefone deve ser uma string",
              required_error: "Informe o telefone",
            })
            .length(11, { message: "O telefone deve ter 11 dígitos" }),
        });

        const { telephone } = params;
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

    this.httpServer.on("post", "/users", async (params: unknown, body: User) => {
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

    this.httpServer.on("patch", "/users/:id/name", async (params: { id: number }, body: User) => {
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
      updateNameSchema.parse({ id, name });

      const user = await this.updateUser.execute({ id, name });

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
    });

    this.httpServer.on(
      "patch",
      "/users/:id/telephone",
      async (params: { id: number }, body: User) => {
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
        updateTelephoneSchema.parse({ id, telephone });

        const user = await this.updateTelephone.execute({ id, telephone });

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
      "/users/:id/password",
      async (params: { id: number }, body: User) => {
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
        updatePasswordSchema.parse({ id, password });

        const user = await this.updatePasswordUser.execute({ id, password });

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

    this.httpServer.on("delete", "/users/:id", async (params: { id: number }, body: unknown) => {
      const deleteSchema = z.object({
        id: z
          .number({
            invalid_type_error: "O ID deve ser um número",
            required_error: "Informe o ID",
          })
          .min(1, { message: "Informe um ID válido" }),
      });

      const { id } = params;
      deleteSchema.parse({ id });

      const user = await this.deleteUser.execute({ id });

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
    });
  }
}

export { UserController };
