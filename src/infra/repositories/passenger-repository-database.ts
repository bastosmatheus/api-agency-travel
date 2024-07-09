import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { Passenger } from "@/core/entities/passenger";
import { DatabaseConnection } from "../database/database-connection";

class PassengerRepositoryDatabase implements PassengerRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Passenger[]> {
    const passengers = await this.databaseConnection.query(
      `
      SELECT
      passengers.id,
      passengers.seat,
      passengers.payment,
      passengers.id_travel,
      passengers.id_user,
      departure_station.name AS departure_location,
      departure_station.city AS departure_city,
      departure_station.uf AS departure_uf,
      arrival_station.name AS arrival_location,
      arrival_station.city AS arrival_city,
      arrival_station.uf AS arrival_uf
      FROM passengers
      INNER JOIN users ON users.id = passengers.id_user
      INNER JOIN travels ON travels.id = passengers.id_travel
      INNER JOIN bus_stations AS departure_station ON travels.id_busStation_departureLocation = departure_station.id
      INNER JOIN bus_stations AS arrival_station ON travels.id_busStation_arrivalLocation = arrival_station.id
      `,
      []
    );

    return passengers;
  }

  public async findById(id: number): Promise<Passenger | null> {
    const [passenger] = await this.databaseConnection.query(
      `
      SELECT * FROM passengers
      WHERE passengers.id = $1
      `,
      [id]
    );

    if (!passenger) {
      return null;
    }

    return Passenger.restore(
      passenger.id,
      passenger.seat,
      passenger.payment,
      passenger.id_travel,
      passenger.id_user
    );
  }

  public async create(passenger: Passenger): Promise<Passenger> {
    const [passengerData] = await this.databaseConnection.query(
      "INSERT INTO passengers (seat, payment, id_travel, id_user) VALUES ($1, $2, $3, $4) RETURNING *",
      [passenger.seat, passenger.payment, passenger.id_travel, passenger.id_user]
    );

    return passengerData;
  }

  public async delete(id: number): Promise<Passenger> {
    const [passenger] = await this.databaseConnection.query(
      "DELETE FROM passengers WHERE id = $1 RETURNING *",
      [id]
    );

    return passenger;
  }
}

export { PassengerRepositoryDatabase };
