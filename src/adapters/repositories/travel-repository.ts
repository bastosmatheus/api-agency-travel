import { Travel } from "@/core/entities/travel";

interface TravelRepository {
  findAll(): Promise<Travel[]>;
  findByOriginCity(city: string): Promise<Travel[]>;
  findByDestinationCity(city: string): Promise<Travel[]>;
  findByDepartureDate(date: Date, city: string): Promise<Travel[]>;
  findById(id: number): Promise<Travel | null>;
  create(travel: Travel): Promise<Travel>;
  delete(id: number): Promise<Travel>;
}

export { TravelRepository };
