import { BusStation } from "@/core/entities/bus-station";
import { NotFoundError } from "../errors/not-found-error";
import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { Either, failure, success } from "@/utils/either";

type FindBusStationByNameRequest = {
  name: string;
};

class FindBusStationByName {
  constructor(private busStationRepository: BusStationRepository) {}

  public async execute({
    name,
  }: FindBusStationByNameRequest): Promise<Either<NotFoundError, BusStation>> {
    const busStation = await this.busStationRepository.findByName(name);

    if (!busStation) {
      return failure(new NotFoundError(`Nenhuma rodoviária encontrada com o nome: ${name}`));
    }

    return success(busStation);
  }
}

export { FindBusStationByName };
