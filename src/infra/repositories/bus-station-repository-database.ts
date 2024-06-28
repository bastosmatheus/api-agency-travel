import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { BusStation } from "@/core/entities/bus-station";
import { DatabaseConnection } from "../database/database-connection";

class BusStationRepositoryDatabase implements BusStationRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<BusStation[]> {
    const busStations = await this.databaseConnection.query("SELECT * FROM bus_stations", []);

    return busStations;
  }

  public async findByCity(city: string): Promise<BusStation[]> {
    const busStations = await this.databaseConnection.query(
      "SELECT * FROM bus_stations WHERE city = $1",
      [city]
    );

    return busStations;
  }

  public async findByName(name: string): Promise<BusStation | null> {
    const [busStation] = await this.databaseConnection.query(
      "SELECT * FROM bus_stations WHERE name = $1",
      [name]
    );

    if (!busStation) {
      return null;
    }

    return BusStation.restore(busStation.id, busStation.name, busStation.city, busStation.uf);
  }

  public async findById(id: number): Promise<BusStation | null> {
    const [busStation] = await this.databaseConnection.query(
      "SELECT * FROM bus_stations WHERE id = $1",
      [id]
    );

    if (!busStation) {
      return null;
    }

    return BusStation.restore(busStation.id, busStation.name, busStation.city, busStation.uf);
  }

  public async create(busStation: BusStation): Promise<BusStation> {
    const [busStationData] = await this.databaseConnection.query(
      "INSERT INTO bus_stations (name, city, uf) VALUES ($1, $2, $3) RETURNING *",
      [busStation.name, busStation.city, busStation.uf]
    );

    return busStationData;
  }

  public async delete(id: number): Promise<BusStation> {
    const [busStation] = await this.databaseConnection.query(
      "DELETE FROM bus_stations WHERE id = $1",
      [id]
    );

    return busStation;
  }
}

export { BusStationRepositoryDatabase };
