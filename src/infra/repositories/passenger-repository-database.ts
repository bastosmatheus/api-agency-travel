import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { Passenger } from "@/core/entities/passenger";
import { DatabaseConnection } from "../database/database-connection";

class PassengerRepositoryDatabase implements PassengerRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Passenger[]> {
    const passengers = await this.databaseConnection.query("SELECT * FROM passengers", []);

    return passengers;
  }

  public async findByRg(rg: string): Promise<Passenger | null> {
    const [passenger] = await this.databaseConnection.query(
      "SELECT * FROM passengers WHERE rg = $1",
      [rg]
    );

    if (!passenger) {
      return null;
    }

    return Passenger.restore(
      passenger.id,
      passenger.name,
      passenger.rg,
      passenger.seat,
      passenger.id_travel
    );
  }

  public async findById(id: number): Promise<Passenger | null> {
    const [passenger] = await this.databaseConnection.query(
      "SELECT * FROM passengers WHERE id = $1",
      [id]
    );

    if (!passenger) {
      return null;
    }

    return Passenger.restore(
      passenger.id,
      passenger.name,
      passenger.rg,
      passenger.seat,
      passenger.id_travel
    );
  }

  public async create(passenger: Passenger): Promise<Passenger> {
    const [passengerData] = await this.databaseConnection.query(
      "INSERT INTO passengers (name, rg, seat, id_travel) VALUES ($1, $2, $3, $4) RETURNING *",
      [passenger.name, passenger.rg, passenger.seat, passenger.id_travel]
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
