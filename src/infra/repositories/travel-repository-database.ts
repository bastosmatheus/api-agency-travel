import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { Travel } from "@/core/entities/travel";
import { DatabaseConnection } from "../database/database-connection";

class TravelRepositoryDatabase implements TravelRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Travel[]> {
    const travels = await this.databaseConnection.query("SELECT * FROM travels", []);

    return travels;
  }

  public async findByOriginCity(city: string): Promise<Travel[]> {
    const travels = await this.databaseConnection.query("SELECT * FROM travels WHERE city = $1", [
      city,
    ]);

    return travels;
  }

  public async findByDestinationCity(city: string): Promise<Travel[]> {
    const travels = await this.databaseConnection.query("SELECT * FROM travels WHERE city = $1", [
      city,
    ]);

    return travels;
  }

  public async findByDepartureDate(date: Date, city: string): Promise<Travel[]> {
    const travels = await this.databaseConnection.query(
      "SELECT * FROM travels WHERE departure_date = $1 AND city = $2",
      [date, city]
    );

    return travels;
  }

  public async findById(id: number): Promise<Travel | null> {
    const [travel] = await this.databaseConnection.query("SELECT * FROM travels WHERE id = $1", [
      id,
    ]);

    return Travel.restore(
      travel.id,
      travel.departure_date,
      travel.arrival_date,
      travel.bus_seat,
      travel.price,
      travel.distance_km,
      travel.duration,
      travel.available_seats,
      travel.id_busStation_derpatureLocation,
      travel.id_busStation_arrivalLocation
    );
  }

  public async create(travel: Travel): Promise<Travel> {
    const [travelData] = await this.databaseConnection.query(
      "INSERT INTO travels (departure_date, arrival_date, bus_seat, price, distance_km, duration, available_seats, id_busStation_derpatureLocation, id_busStation_arrivalLocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        travel.departure_date,
        travel.arrival_date,
        travel.bus_seat,
        travel.price,
        travel.distance_km,
        travel.duration,
        travel.available_seats,
        travel.id_busStation_derpatureLocation,
        travel.id_busStation_arrivalLocation,
      ]
    );

    return travelData;
  }

  public async delete(id: number): Promise<Travel> {
    const [travel] = await this.databaseConnection.query("DELETE FROM travels WHERE id = $1", [id]);

    return travel;
  }
}

export { TravelRepositoryDatabase };
