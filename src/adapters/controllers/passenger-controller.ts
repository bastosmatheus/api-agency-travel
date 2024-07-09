import {
  CancelTravel,
  CreatePassenger,
  FindPassengerById,
  FindPassengers,
} from "@/application/use-cases/passenger";
import { Passenger } from "@/core/entities/passenger";
import { HttpServer } from "@/infra/http/http-server";
import { AuthMiddleware } from "@/infra/middlewares/auth-middleware";
import { z } from "zod";

class PassengerController {
  constructor(
    private httpServer: HttpServer,
    private findPassengers: FindPassengers,
    private findPassengerById: FindPassengerById,
    private createPassenger: CreatePassenger,
    private cancelTravel: CancelTravel
  ) {
    this.httpServer.on("get", [], "/passengers", async () => {
      const passengers = await this.findPassengers.execute();

      return {
        type: "OK",
        statusCode: 200,
        passengers,
      };
    });

    this.httpServer.on(
      "get",
      [AuthMiddleware.verifyToken],
      "/passengers/:id",
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

        const passenger = await this.findPassengerById.execute({ id: Number(id) });

        if (passenger.isFailure()) {
          return {
            type: passenger.value.type,
            statusCode: passenger.value.statusCode,
            message: passenger.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          passenger: {
            ...passenger.value,
          },
        };
      }
    );

    this.httpServer.on(
      "post",
      [AuthMiddleware.verifyToken],
      "/passengers",
      async (params: unknown, body: Passenger) => {
        const createSchema = z.object({
          seat: z
            .number({
              invalid_type_error: "O assento deve ser um número",
              required_error: "Informe o número do assento",
            })
            .min(1, { message: "Os assentos vão de 1 até 46" })
            .max(46, { message: "Os assentos vão de 1 até 46" }),
          payment: z.enum(["Pix", "Cartão"], {
            errorMap: (status, ctx) => {
              if (status.code === "invalid_enum_value") {
                return {
                  message: "Informe um tipo válido para forma de pagamento: Pix ou Cartão",
                };
              }

              if (status.code === "invalid_type" && status.received === "undefined") {
                return {
                  message: "Informe a forma de pagamento",
                };
              }

              if (status.code === "invalid_type" && status.received !== "string") {
                return {
                  message: "A forma de pagamento deve ser uma string",
                };
              }
            },
          }),
          id_travel: z
            .number({
              invalid_type_error: "O ID da viagem deve ser um número",
              required_error: "Informe o ID da viagem",
            })
            .min(1, { message: "Informe um ID da viagem válido" }),
          id_user: z
            .number({
              invalid_type_error: "O ID do usuário deve ser um número",
              required_error: "Informe o ID do usuário",
            })
            .min(1, { message: "Informe um ID de usuário válido" }),
        });

        const { seat, payment, id_travel, id_user } = body;
        createSchema.parse({ seat, payment, id_travel, id_user });

        const passenger = await this.createPassenger.execute({ seat, payment, id_travel, id_user });

        if (passenger.isFailure()) {
          return {
            type: passenger.value.type,
            statusCode: passenger.value.statusCode,
            message: passenger.value.message,
          };
        }

        return {
          message: "Passageiro registrado",
          type: "Created",
          statusCode: 201,
          passenger: {
            ...passenger.value,
          },
        };
      }
    );

    this.httpServer.on(
      "delete",
      [AuthMiddleware.verifyToken],
      "/passengers/:id",
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

        const passenger = await this.cancelTravel.execute({ id: Number(id) });

        if (passenger.isFailure()) {
          return {
            type: passenger.value.type,
            statusCode: passenger.value.statusCode,
            message: passenger.value.message,
          };
        }

        return {
          message: "Viagem cancelada",
          type: "OK",
          statusCode: 200,
          passenger: {
            ...passenger.value,
          },
        };
      }
    );
  }
}

export { PassengerController };
