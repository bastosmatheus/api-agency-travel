import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { Travel } from "@/core/entities/travel";

type DeleteTravelRequest = {
  id: number;
};

class DeleteTravel {
  constructor(private travelRepository: TravelRepository) {}

  public async execute({ id }: DeleteTravelRequest): Promise<Either<NotFoundError, Travel>> {
    const travelExists = await this.travelRepository.findById(id);

    if (!travelExists) {
      return failure(new NotFoundError(`Nenhuma viagem encontrada com o ID: ${id}`));
    }

    const travel = await this.travelRepository.delete(id);

    return success(travel);
  }
}

export { DeleteTravel };
