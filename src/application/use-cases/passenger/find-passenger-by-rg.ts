import { Passenger } from "@/core/entities/passenger";
import { NotFoundError } from "../errors/not-found-error";
import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { Either, failure, success } from "@/utils/either";

type FindPassengerByRgRequest = {
  rg: string;
};

class FindPassengerByRg {
  constructor(private passengerRepository: PassengerRepository) {}

  public async execute({
    rg,
  }: FindPassengerByRgRequest): Promise<Either<NotFoundError, Passenger>> {
    const passenger = await this.passengerRepository.findByRg(rg);

    if (!passenger) {
      return failure(new NotFoundError(`Nenhum passageiro encontrado com o rg: ${rg}`));
    }

    return success(passenger);
  }
}

export { FindPassengerByRg };
