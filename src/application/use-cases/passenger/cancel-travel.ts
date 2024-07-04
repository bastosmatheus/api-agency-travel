import { Passenger } from "@/core/entities/passenger";
import { NotFoundError } from "../errors/not-found-error";
import { BadRequestError } from "../errors/bad-request-error";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { Either, failure, success } from "@/utils/either";

type CancelTravelRequest = {
  id: number;
};

class CancelTravel {
  constructor(
    private passengerRepository: PassengerRepository,
    private travelRepository: TravelRepository
  ) {}

  public async execute({
    id,
  }: CancelTravelRequest): Promise<Either<NotFoundError | BadRequestError, Passenger>> {
    const passengerExists = await this.passengerRepository.findById(id);

    if (!passengerExists) {
      return failure(new NotFoundError(`Nenhum passageiro encontrado com o ID: ${id}`));
    }

    const travelExists = await this.travelRepository.findById(passengerExists.id_travel);

    if (!travelExists) {
      return failure(
        new NotFoundError(`Nenhuma viagem encontrada com o ID: ${passengerExists.id_travel}`)
      );
    }

    const isPossibleCancelTravel = passengerExists.cancelTravel(
      travelExists.departure_date,
      new Date(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1 <= 12 ? new Date().getMonth() + 1 : 12
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}Z`
      )
    );

    if (!isPossibleCancelTravel) {
      return failure(
        new BadRequestError(`O cancelamento só pode ser feito até 1 hora antes do embarque`)
      );
    }

    const passenger = await this.passengerRepository.delete(id);
    travelExists.updateAvailableSeatsIfCanceled(passengerExists.seat);

    return success(passenger);
  }
}

export { CancelTravel };
