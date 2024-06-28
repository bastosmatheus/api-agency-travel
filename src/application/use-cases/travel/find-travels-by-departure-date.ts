import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { Either, failure, success } from "@/utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { Travel } from "@/core/entities/travel";

type FindTravelsByDepartureDateRequest = {
  date: Date;
  city: string;
};

class FindTravelsByDepartureDate {
  constructor(
    private travelRepository: TravelRepository,
    private busStationRepository: BusStationRepository
  ) {}

  public async execute({
    date,
    city,
  }: FindTravelsByDepartureDateRequest): Promise<Either<NotFoundError, Travel[]>> {
    const cityExists = await this.busStationRepository.findByCity(city);

    if (cityExists.length === 0) {
      return failure(new NotFoundError(`Nós não trabalhamos com nenhuma rodoviária em ${city}`));
    }

    const travels = await this.travelRepository.findByDepartureDate(date, city);

    return success(travels);
  }
}

export { FindTravelsByDepartureDate };
