import { Travel } from "@/core/entities/travel";

interface TravelRepository {
  findAll(): Promise<Travel[]>;
  findByOriginCity(city: string): Promise<Travel[]>;
  findByDestinationCity(city: string): Promise<Travel[]>;
  findByExitLocation(location: string): Promise<Travel[]>;
  findByArrivalLocation(location: string): Promise<Travel[]>;
  findByExitTime(time: string): Promise<Travel[]>;
  findByExitDate(date: Date): Promise<Travel[]>;
  findById(id: number): Promise<Travel | null>;
  create(travel: Travel): Promise<Travel>;
  updateAvailableSeats(id: number): Promise<Travel>;
  delete(id: number): Promise<Travel>;
}

export { TravelRepository };
