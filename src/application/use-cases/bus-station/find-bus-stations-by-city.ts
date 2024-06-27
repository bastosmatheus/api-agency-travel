import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";

type FindBusStationsByCityRequest = {
  city: string;
};

class FindBusStationsByCity {
  constructor(private busStationRepository: BusStationRepository) {}

  public async execute({ city }: FindBusStationsByCityRequest) {
    const busStations = await this.busStationRepository.findByCity(city);

    return busStations;
  }
}

export { FindBusStationsByCity };
