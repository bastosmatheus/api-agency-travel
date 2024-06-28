import { Fetch } from "@/infra/fetch/fetch";
import { BusStation } from "@/core/entities/bus-station";
import { ConflictError } from "../errors/conflict-error";
import { Either, failure, success } from "@/utils/either";
import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { BadRequestError } from "../errors/bad-request-error";

type CreateBusStationRequest = {
  name: string;
  city: string;
  uf: string;
};

class CreateBusStation {
  constructor(private busStationRepository: BusStationRepository, private fetch: Fetch) {}

  public async execute({
    name,
    city,
    uf,
  }: CreateBusStationRequest): Promise<Either<ConflictError | BadRequestError, BusStation>> {
    const busStationExists = await this.busStationRepository.findByName(name);

    if (busStationExists) {
      return failure(new ConflictError(`Essa rodoviária já está cadastrada`));
    }

    const response = await this.fetch.post(
      "https://places.googleapis.com/v1/places:searchText",
      { textQuery: `${name}, ${city}`, languageCode: "pt-BR", rankPreference: "RELEVANCE" },
      "places.types,places.displayName"
    );

    if (!response.places) {
      return failure(new BadRequestError(`Nenhuma rodoviária encontrada com esse nome: ${name}`));
    }

    const busStationValid = response.places[0];
    const types = busStationValid.types;
    const formattedAddress = busStationValid.displayName.text;
    const typesValids =
      types.includes("bus_station") ||
      types.includes("agency_travel") ||
      types.includes("bus_stop") ||
      types.includes("transit_station");

    if (!typesValids) {
      return failure(new BadRequestError(`O local pesquisado não é uma rodoviária`));
    }

    const busStationCreated = BusStation.create(formattedAddress, city, uf);
    const busStation = await this.busStationRepository.create(busStationCreated);

    return success(busStation);
  }
}

export { CreateBusStation };
