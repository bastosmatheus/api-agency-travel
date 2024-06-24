import { Passenger } from "../../core/entities/passenger";

interface PassengerRepository {
  findAll(): Promise<Passenger[]>;
  findByRg(rg: string): Promise<Passenger | null>;
  create(name: string, rg: string): Promise<Passenger>;
  delete(id: number): Promise<Passenger>;
}

export { PassengerRepository };
