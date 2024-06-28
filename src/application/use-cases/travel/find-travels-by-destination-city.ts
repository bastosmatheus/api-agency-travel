import { TravelRepository } from "@/adapters/repositories/travel-repository";

type FindTravelsByDestinationCityRequest = {
  city: string;
};

class FindTravelsByDestinationCity {
  constructor(private travelRepository: TravelRepository) {}

  public async execute({ city }: FindTravelsByDestinationCityRequest) {
    const travels = await this.travelRepository.findByDestinationCity(city);

    return travels;
  }
}

export { FindTravelsByDestinationCity };
