import { Passenger } from "@/core/entities/passenger";
import { NotFoundError } from "../errors/not-found-error";
import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { Either, failure, success } from "@/utils/either";

type FindPassengerByIdRequest = {
  id: number;
};

class FindPassengerById {
  constructor(private passengerRepository: PassengerRepository) {}

  public async execute({
    id,
  }: FindPassengerByIdRequest): Promise<Either<NotFoundError, Passenger>> {
    const passenger = await this.passengerRepository.findById(id);

    if (!passenger) {
      return failure(new NotFoundError(`Nenhum passageiro encontrado com o ID: ${id}`));
    }

    return success(passenger);
  }
}

export { FindPassengerById };
