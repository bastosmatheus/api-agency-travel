import { BusStation } from "@/core/entities/bus-station";
import { NotFoundError } from "../errors/not-found-error";
import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { Either, failure, success } from "@/utils/either";

type DeleteBusStationRequest = {
  id: number;
};

class DeleteBusStation {
  constructor(private busStationRepository: BusStationRepository) {}

  public async execute({
    id,
  }: DeleteBusStationRequest): Promise<Either<NotFoundError, BusStation>> {
    const busStationExists = await this.busStationRepository.findById(id);

    if (!busStationExists) {
      return failure(new NotFoundError(`Nenhuma rodoviária encontrada com o ID: ${id}`));
    }

    const busStation = await this.busStationRepository.delete(id);

    return success(busStation);
  }
}

export { DeleteBusStation };
