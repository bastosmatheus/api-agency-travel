import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";

class FindBusStations {
  constructor(private busStationRepository: BusStationRepository) {}

  public async execute() {
    const busStations = await this.busStationRepository.findAll();

    return busStations;
  }
}

export { FindBusStations };
