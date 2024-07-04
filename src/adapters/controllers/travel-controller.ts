import {
  CreateTravel,
  DeleteTravel,
  FindTravelById,
  FindTravels,
  FindTravelsByDepartureDate,
  FindTravelsByDestinationCity,
  FindTravelsByOriginCity,
} from "@/application/use-cases/travel";
import { Travel } from "@/core/entities/travel";
import { HttpServer } from "@/infra/http/http-server";
import { z } from "zod";

class TravelController {
  constructor(
    private httpServer: HttpServer,
    private findTravels: FindTravels,
    private findTravelsByOriginCity: FindTravelsByOriginCity,
    private findTravelsByDestinationCity: FindTravelsByDestinationCity,
    private findTravelsByDepartureDate: FindTravelsByDepartureDate,
    private findTravelById: FindTravelById,
    private createTravel: CreateTravel,
    private deleteTravel: DeleteTravel
  ) {
    this.httpServer.on("get", "/travels", async () => {
      const travels = await this.findTravels.execute();

      return {
        type: "OK",
        statusCode: 200,
        travels,
      };
    });

    this.httpServer.on(
      "get",
      "/travels/origin/:city",
      async (params: { city: string }, body: unknown) => {
        const findByOriginCitySchema = z.object({
          city: z
            .string({
              invalid_type_error: "A cidade deve ser uma string",
              required_error: "Informe o nome da cidade",
            })
            .min(2, { message: "O nome da cidade deve ter no mínimo 2 caracteres" }),
        });

        const { city } = params;
        findByOriginCitySchema.parse({ city });

        const travels = await this.findTravelsByOriginCity.execute({ city });

        return {
          type: "OK",
          statusCode: 200,
          travels,
        };
      }
    );

    this.httpServer.on(
      "get",
      "/travels/destination/:city",
      async (params: { city: string }, body: unknown) => {
        const findByDestinationCitySchema = z.object({
          city: z
            .string({
              invalid_type_error: "A cidade deve ser uma string",
              required_error: "Informe o nome da cidade",
            })
            .min(2, { message: "O nome da cidade deve ter no mínimo 2 caracteres" }),
        });

        const { city } = params;
        findByDestinationCitySchema.parse({ city });

        const travels = await this.findTravelsByDestinationCity.execute({ city });

        return {
          type: "OK",
          statusCode: 200,
          travels,
        };
      }
    );

    this.httpServer.on(
      "get",
      "/travels/city/:city",
      async (params: { city: string }, body: unknown, query: { date: string }) => {
        const findByDepartureDateSchema = z.object({
          date: z
            .string({
              invalid_type_error: "A data deve ser uma string",
              required_error: "Informe a data",
            })
            .datetime({
              message: "Informe uma data válida (YYYY-MM-DD HH:MM:SSZ)",
            }),
          city: z
            .string({
              invalid_type_error: "A cidade deve ser uma string",
              required_error: "Informe o nome da cidade",
            })
            .min(2, { message: "O nome da cidade deve ter no mínimo 2 caracteres" }),
        });

        const { city } = params;
        const { date } = query;

        findByDepartureDateSchema.parse({ date, city });

        const dateFormatted = new Date(date);

        const travels = await this.findTravelsByDepartureDate.execute({
          date: dateFormatted,
          city,
        });

        return {
          type: "OK",
          statusCode: 200,
          travels,
        };
      }
    );

    this.httpServer.on("get", "/travels/:id", async (params: { id: number }, body: unknown) => {
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

      const travel = await this.findTravelById.execute({ id });

      if (travel.isFailure()) {
        return {
          type: travel.value.type,
          statusCode: travel.value.statusCode,
          message: travel.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        travel: {
          ...travel.value,
        },
      };
    });

    this.httpServer.on("post", "/travels", async (params: unknown, body: Travel) => {
      const createSchema = z.object({
        departure_date: z
          .string({
            invalid_type_error: "A data deve ser uma string",
            required_error: "Informe a data",
          })
          .datetime({
            message: "Informe uma data válida (YYYY-MM-DD HH:MM:SSZ)",
          }),
        bus_seat: z.enum(["Convencional", "Semi-leito", "Leito", "Cama"], {
          errorMap: (status, ctx) => {
            if (status.code === "invalid_enum_value") {
              return {
                message:
                  "Informe um tipo válido de poltrona: Convencional, Semi-leito, Leito ou Cama",
              };
            }

            if (status.code === "invalid_type" && status.received === "undefined") {
              return {
                message: "Informe a poltrona",
              };
            }

            if (status.code === "invalid_type" && status.received !== "string") {
              return {
                message: "A poltrona deve ser uma string",
              };
            }
          },
        }),
        price: z
          .number({
            invalid_type_error: "O preço deve ser um número",
            required_error: "Informe o preço",
          })
          .min(1, { message: "O preço deve ser maior que 1R$" }),
        id_busStation_departureLocation: z
          .number({
            invalid_type_error: "O ID da rodoviária de embarque deve ser um número",
            required_error: "Informe o ID da rodoviária de embarque",
          })
          .min(1, { message: "Informe um ID rodoviária de embarque válido" }),
        id_busStation_arrivalLocation: z
          .number({
            invalid_type_error: "O ID da rodoviária de desembarque deve ser um número",
            required_error: "Informe o ID da rodoviária de dsembarque",
          })
          .min(1, { message: "Informe um ID rodoviária de desembarque válido" }),
      });

      const {
        departure_date,
        bus_seat,
        price,
        id_busStation_departureLocation,
        id_busStation_arrivalLocation,
      } = body;
      createSchema.parse({
        departure_date,
        bus_seat,
        price,
        id_busStation_departureLocation,
        id_busStation_arrivalLocation,
      });

      const travel = await this.createTravel.execute({
        departure_date,
        bus_seat,
        price,
        id_busStation_departureLocation,
        id_busStation_arrivalLocation,
      });

      if (travel.isFailure()) {
        return {
          type: travel.value.type,
          statusCode: travel.value.statusCode,
          message: travel.value.message,
        };
      }

      return {
        message: "Viagem registrada",
        type: "Created",
        statusCode: 201,
        travel: {
          ...travel.value,
        },
      };
    });

    this.httpServer.on("delete", "/travels/:id", async (params: { id: number }, body: unknown) => {
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

      const travel = await this.deleteTravel.execute({ id });

      if (travel.isFailure()) {
        return {
          type: travel.value.type,
          statusCode: travel.value.statusCode,
          message: travel.value.message,
        };
      }

      return {
        message: "Viagem excluida",
        type: "OK",
        statusCode: 200,
        travel: {
          ...travel.value,
        },
      };
    });
  }
}

export { TravelController };
