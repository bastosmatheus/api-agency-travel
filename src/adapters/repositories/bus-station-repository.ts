import { BusStation } from "@/core/entities/bus-station";

interface BusStationRepository {
  findAll(): Promise<BusStation[]>;
  findByCity(city: string): Promise<BusStation[]>;
  findByName(name: string): Promise<BusStation | null>;
  findById(id: number): Promise<BusStation | null>;
  create(busStation: BusStation): Promise<BusStation>;
  delete(id: number): Promise<BusStation>;
}

export { BusStationRepository };
