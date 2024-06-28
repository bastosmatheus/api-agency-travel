import { TravelRepository } from "@/adapters/repositories/travel-repository";

type FindTravelsByOriginCityRequest = {
  city: string;
};

class FindTravelsByOriginCity {
  constructor(private travelRepository: TravelRepository) {}

  public async execute({ city }: FindTravelsByOriginCityRequest) {
    const travels = await this.travelRepository.findByOriginCity(city);

    return travels;
  }
}

export { FindTravelsByOriginCity };
