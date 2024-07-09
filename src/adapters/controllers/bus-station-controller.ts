import {
  CreateBusStation,
  DeleteBusStation,
  FindBusStationById,
  FindBusStationByName,
  FindBusStations,
  FindBusStationsByCity,
} from "@/application/use-cases/bus-station";
import { BusStation } from "@/core/entities/bus-station";
import { HttpServer } from "@/infra/http/http-server";
import { AdminMiddleware } from "@/infra/middlewares/admin-middleware";
import { z } from "zod";

class BusStationController {
  constructor(
    private httpServer: HttpServer,
    private findBusStations: FindBusStations,
    private findBusStationsByCity: FindBusStationsByCity,
    private findBusStationById: FindBusStationById,
    private findBusStationByName: FindBusStationByName,
    private createBusStation: CreateBusStation,
    private deleteBusStation: DeleteBusStation
  ) {
    this.httpServer.on("get", [], "/bus-stations", async () => {
      const busStations = await this.findBusStations.execute();

      return {
        type: "OK",
        statusCode: 200,
        busStations,
      };
    });

    this.httpServer.on(
      "get",
      [],
      "/bus-stations/city",
      async (params: unknown, body: unknown, query: { city: string }) => {
        const findByCitySchema = z.object({
          city: z
            .string({
              invalid_type_error: "A cidade deve ser uma string",
              required_error: "Informe o nome da cidade em uma query string",
            })
            .min(2, { message: "O nome da cidade deve ter no mínimo 2 caracteres" }),
        });

        const { city } = query;
        findByCitySchema.parse({ city });

        const busStations = await this.findBusStationsByCity.execute({
          city,
        });

        return {
          type: "OK",
          statusCode: 200,
          busStations,
        };
      }
    );

    this.httpServer.on(
      "get",
      [],
      "/bus-stations/name",
      async (params: unknown, body: unknown, query: { name: string }) => {
        const findByNameSchema = z.object({
          name: z
            .string({
              invalid_type_error: "O nome da rodoviária deve ser uma string",
              required_error: "Informe o nome da rodoviária em uma query string",
            })
            .min(2, { message: "O nome da rodoviária deve ter no mínimo 2 caracteres" }),
        });

        const { name } = query;
        findByNameSchema.parse({ name });

        const busStation = await this.findBusStationByName.execute({ name });

        if (busStation.isFailure()) {
          return {
            type: busStation.value.type,
            statusCode: busStation.value.statusCode,
            message: busStation.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          busStation: {
            ...busStation.value,
          },
        };
      }
    );

    this.httpServer.on(
      "get",
      [],
      "/bus-stations/:id",
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

        const busStation = await this.findBusStationById.execute({ id: Number(id) });

        if (busStation.isFailure()) {
          return {
            type: busStation.value.type,
            statusCode: busStation.value.statusCode,
            message: busStation.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          busStation: {
            ...busStation.value,
          },
        };
      }
    );

    this.httpServer.on(
      "post",
      [AdminMiddleware.verifyToken],
      "/bus-stations",
      async (params: unknown, body: BusStation) => {
        const createSchema = z.object({
          name: z
            .string({
              invalid_type_error: "O nome da rodoviária deve ser uma string",
              required_error: "Informe o nome da rodoviária",
            })
            .min(2, { message: "O nome da rodoviária deve ter no mínimo 2 caracteres" }),
          city: z
            .string({
              invalid_type_error: "A cidade deve ser uma string",
              required_error: "Informe o nome da cidade",
            })
            .min(2, { message: "O nome da cidade deve ter no mínimo 2 caracteres" }),
          uf: z
            .string({
              invalid_type_error: "A unidade federativa deve ser uma string",
              required_error: "Informe a unidade federativa",
            })
            .length(2, { message: "A unidade federativa deve ter 2 caracteres" }),
        });

        const { name, city, uf } = body;
        createSchema.parse({ name, city, uf });

        const busStation = await this.createBusStation.execute({ name, city, uf });

        if (busStation.isFailure()) {
          return {
            type: busStation.value.type,
            statusCode: busStation.value.statusCode,
            message: busStation.value.message,
          };
        }

        return {
          message: "Rodoviária registrada",
          type: "Created",
          statusCode: 201,
          busStation: {
            ...busStation.value,
          },
        };
      }
    );

    this.httpServer.on(
      "delete",
      [AdminMiddleware.verifyToken],
      "/bus-stations/:id",
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

        const busStation = await this.deleteBusStation.execute({ id: Number(id) });

        if (busStation.isFailure()) {
          return {
            type: busStation.value.type,
            statusCode: busStation.value.statusCode,
            message: busStation.value.message,
          };
        }

        return {
          message: "Rodoviária excluida",
          type: "OK",
          statusCode: 200,
          busStation: {
            ...busStation.value,
          },
        };
      }
    );
  }
}

export { BusStationController };
