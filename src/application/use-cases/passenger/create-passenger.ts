import { Passenger } from "@/core/entities/passenger";
import { Either, failure, success } from "@/utils/either";
import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { NotFoundError } from "../errors/not-found-error";

type CreatePassengerRequest = {
  name: string;
  rg: string;
  seat: number;
  id_travel: number;
};

class CreatePassenger {
  constructor(
    private passengerRepository: PassengerRepository,
    private travelRepository: TravelRepository
  ) {}

  public async execute({
    name,
    rg,
    seat,
    id_travel,
  }: CreatePassengerRequest): Promise<Either<NotFoundError, Passenger>> {
    const travelExists = await this.travelRepository.findById(id_travel);

    if (!travelExists) {
      return failure(new NotFoundError(`Nenhuma viagem encontrada com o ID: ${id_travel}`));
    }

    const passengerCreated = Passenger.create(name, rg, seat, id_travel);

    const passenger = await this.passengerRepository.create(passengerCreated);

    return success(passenger);
  }
}

export { CreatePassenger };
