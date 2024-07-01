import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { BusStation } from "@/core/entities/bus-station";

class InMemoryBusStationRepository implements BusStationRepository {
  private busStations: BusStation[] = [];

  public async findAll(): Promise<BusStation[]> {
    return this.busStations;
  }

  public async findByCity(city: string): Promise<BusStation[]> {
    const busStations = this.busStations.filter((busStation) => busStation.city === city);

    return busStations;
  }

  public async findByName(name: string): Promise<BusStation | null> {
    const busStation = this.busStations.find((busStation) => busStation.name === name);

    if (!busStation) {
      return null;
    }

    return BusStation.restore(
      busStation.id as number,
      busStation.name,
      busStation.city,
      busStation.uf
    );
  }

  public async findById(id: number): Promise<BusStation | null> {
    const busStation = this.busStations.find((busStation) => busStation.id === id);

    if (!busStation) {
      return null;
    }

    return BusStation.restore(
      busStation.id as number,
      busStation.name,
      busStation.city,
      busStation.uf
    );
  }

  public async create(busStation: BusStation): Promise<BusStation> {
    busStation.id = Math.round(Math.random() * 1000);

    this.busStations.push(busStation);

    return busStation;
  }

  public async delete(id: number): Promise<BusStation> {
    const busStationIndex = this.busStations.findIndex((busStation) => busStation.id === id);

    const busStation = this.busStations[busStationIndex];

    this.busStations.splice(busStationIndex, 1);

    return busStation;
  }
}

export { InMemoryBusStationRepository };
