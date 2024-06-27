import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { BusStation } from "@/core/entities/bus-station";

type FindBusStationByIdRequest = {
  id: number;
};

class FindBusStationById {
  constructor(private busStationRepository: BusStationRepository) {}

  public async execute({
    id,
  }: FindBusStationByIdRequest): Promise<Either<NotFoundError, BusStation>> {
    const busStation = await this.busStationRepository.findById(id);

    if (!busStation) {
      return failure(new NotFoundError(`Nenhuma rodoviária encontrada com o ID: ${id}`));
    }

    return success(busStation);
  }
}

export { FindBusStationById };
