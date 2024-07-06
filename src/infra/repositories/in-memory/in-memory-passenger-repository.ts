import { Passenger } from "@/core/entities/passenger";
import { PassengerRepository } from "@/adapters/repositories/passenger-repository";

class InMemoryPassengerRepository implements PassengerRepository {
  private passengers: Passenger[] = [];

  public async findAll(): Promise<Passenger[]> {
    return this.passengers;
  }

  public async findById(id: number): Promise<Passenger | null> {
    const passenger = this.passengers.find((passenger) => passenger.id === id);

    if (!passenger) {
      return null;
    }

    return Passenger.restore(
      passenger.id as number,
      passenger.seat,
      passenger.payment,
      passenger.id_travel,
      passenger.id_user
    );
  }

  public async create(passenger: Passenger): Promise<Passenger> {
    passenger.id = Math.round(Math.random() * 1000);

    this.passengers.push(passenger);

    return passenger;
  }

  public async delete(id: number): Promise<Passenger> {
    const passengerIndex = this.passengers.findIndex((passenger) => passenger.id === id);

    const passenger = this.passengers[passengerIndex];

    this.passengers.splice(passengerIndex, 1);

    return passenger;
  }
}

export { InMemoryPassengerRepository };
