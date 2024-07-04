import {
  CancelTravel,
  CreatePassenger,
  FindPassengerById,
  FindPassengerByRg,
  FindPassengers,
} from "@/application/use-cases/passenger";
import { Passenger } from "@/core/entities/passenger";
import { HttpServer } from "@/infra/http/http-server";
import { z } from "zod";

class PassengerController {
  constructor(
    private httpServer: HttpServer,
    private findPassengers: FindPassengers,
    private findPassengerById: FindPassengerById,
    private findPassengerByRg: FindPassengerByRg,
    private createPassenger: CreatePassenger,
    private cancelTravel: CancelTravel
  ) {
    this.httpServer.on("get", "/passengers", async () => {
      const passengers = await this.findPassengers.execute();

      return {
        type: "OK",
        statusCode: 200,
        passengers,
      };
    });

    this.httpServer.on("get", "/passengers/:id", async (params: { id: number }, body: unknown) => {
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

      const passenger = await this.findPassengerById.execute({ id });

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
    });

    this.httpServer.on(
      "get",
      "/passengers/rg/:rg",
      async (params: { rg: string }, body: unknown) => {
        const findByRgSchema = z.object({
          rg: z
            .string({
              invalid_type_error: "O rg deve ser uma string",
              required_error: "Informe o rg",
            })
            .length(9, { message: "O rg deve ter 9 dígitos" }),
        });

        const { rg } = params;
        findByRgSchema.parse({ rg });

        const passenger = await this.findPassengerByRg.execute({ rg });

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

    this.httpServer.on("post", "/passengers", async (params: unknown, body: Passenger) => {
      const createSchema = z.object({
        name: z
          .string({
            invalid_type_error: "O nome deve ser uma string",
            required_error: "Informe o nome",
          })
          .min(2, { message: "O nome deve conter no minimo 2 caracteres" }),
        rg: z
          .string({
            invalid_type_error: "O rg deve ser uma string",
            required_error: "Informe o rg",
          })
          .length(9, { message: "O rg deve ter 9 dígitos" }),
        seat: z
          .number({
            invalid_type_error: "O assento deve ser um número",
            required_error: "Informe o número do assento",
          })
          .min(1, { message: "Os assentos vão de 1 até 46" })
          .max(46, { message: "Os assentos vão de 1 até 46" }),
        id_travel: z
          .number({
            invalid_type_error: "O ID da viagem deve ser um número",
            required_error: "Informe o ID da viagem",
          })
          .min(1, { message: "Informe um ID válido" }),
      });

      const { name, rg, seat, id_travel } = body;
      createSchema.parse({ name, rg, seat, id_travel });

      const passenger = await this.createPassenger.execute({ name, rg, seat, id_travel });

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
    });

    this.httpServer.on(
      "delete",
      "/passengers/:id",
      async (params: { id: number }, body: unknown) => {
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

        const passenger = await this.cancelTravel.execute({ id });

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
