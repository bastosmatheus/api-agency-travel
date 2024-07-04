import { TravelRepository } from "@/adapters/repositories/travel-repository";

type FindTravelsByDepartureDateRequest = {
  date: Date;
  city: string;
};

class FindTravelsByDepartureDate {
  constructor(private travelRepository: TravelRepository) {}

  public async execute({ date, city }: FindTravelsByDepartureDateRequest) {
    const travels = await this.travelRepository.findByDepartureDate(date, city);

    return travels;
  }
}

export { FindTravelsByDepartureDate };
