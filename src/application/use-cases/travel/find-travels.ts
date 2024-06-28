import { TravelRepository } from "@/adapters/repositories/travel-repository";

class FindTravels {
  constructor(private travelRepository: TravelRepository) {}

  public async execute() {
    const travels = await this.travelRepository.findAll();

    return travels;
  }
}

export { FindTravels };
