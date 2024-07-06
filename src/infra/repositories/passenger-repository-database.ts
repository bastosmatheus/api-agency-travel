import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { Passenger } from "@/core/entities/passenger";
import { DatabaseConnection } from "../database/database-connection";

class PassengerRepositoryDatabase implements PassengerRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Passenger[]> {
    const passengers = await this.databaseConnection.query("SELECT * FROM passengers", []);

    return passengers;
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
