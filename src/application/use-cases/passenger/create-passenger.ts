import { Passenger } from "@/core/entities/passenger";
import { Either, failure, success } from "@/utils/either";
import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";
import { UserRepository } from "@/adapters/repositories/user-repository";

type CreatePassengerRequest = {
  seat: number;
  payment: string;
  id_travel: number;
  id_user: number;
};

class CreatePassenger {
  constructor(
    private passengerRepository: PassengerRepository,
    private travelRepository: TravelRepository,
    private userRepository: UserRepository
  ) {}

  public async execute({
    seat,
    payment,
    id_travel,
    id_user,
  }: CreatePassengerRequest): Promise<Either<NotFoundError | ConflictError, Passenger>> {
    const travelExists = await this.travelRepository.findById(id_travel);

    if (!travelExists) {
      return failure(new NotFoundError(`Nenhuma viagem encontrada com o ID: ${id_travel}`));
    }

    const userExists = await this.userRepository.findById(id_user);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id_user}`));
    }

    const available_seats = travelExists.updateAvailableSeats(seat);
    const passengerCreated = Passenger.create(seat, payment, id_travel, id_user);
    const passenger = await this.passengerRepository.create(passengerCreated);
    await this.travelRepository.updateAvailableSeats(travelExists.id as number, available_seats);

    return success(passenger);
  }
}

export { CreatePassenger };
