import { PassengerRepository } from "@/adapters/repositories/passenger-repository";

class FindPassengers {
  constructor(private passengerRepository: PassengerRepository) {}

  public async execute() {
    const passengers = await this.passengerRepository.findAll();

    return passengers;
  }
}

export { FindPassengers };
