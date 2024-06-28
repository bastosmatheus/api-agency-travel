import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { Travel } from "@/core/entities/travel";

type FindTravelByIdRequest = {
  id: number;
};

class FindTravelById {
  constructor(private travelRepository: TravelRepository) {}

  public async execute({ id }: FindTravelByIdRequest): Promise<Either<NotFoundError, Travel>> {
    const travel = await this.travelRepository.findById(id);

    if (!travel) {
      return failure(new NotFoundError(`Nenhuma viagem encontrada com o ID: ${id}`));
    }

    return success(travel);
  }
}

export { FindTravelById };
