import { Travel } from "@/core/entities/travel";
import { BusStation } from "@/core/entities/bus-station";
import { TravelRepository } from "@/adapters/repositories/travel-repository";

class InMemoryTravelRepository implements TravelRepository {
  private travels: Travel[] = [];
  private busStations: BusStation[] = [
    {
      id: 1,
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    },
    {
      id: 2,
      name: "Rodoviária de Embu das Artes",
      city: "São Paulo",
      uf: "SP",
    },
    {
      id: 3,
      name: "Rodoviária Américo Fontenelle",
      city: "Rio de Janeiro",
      uf: "RJ",
    },
  ];

  public async findAll(): Promise<Travel[]> {
    return this.travels;
  }

  public async findByOriginCity(city: string): Promise<Travel[]> {
    const travels = this.travels.filter((travel) => {
      this.busStations[travel.id_busStation_departureLocation].city === city;
    });

    return travels;
  }

  public async findByDestinationCity(city: string): Promise<Travel[]> {
    const travels = this.travels.filter((travel) => {
      this.busStations[travel.id_busStation_arrivalLocation].city === city;
    });

    return travels;
  }

  public async findByDepartureDate(date: Date, city: string): Promise<Travel[]> {
    const travels = this.travels.filter((travel) => {
      this.busStations[travel.id_busStation_arrivalLocation].city === city &&
        travel.departure_date === date;
    });

    return travels;
  }

  public async findById(id: number): Promise<Travel | null> {
    const travel = this.travels.find((travel) => travel.id === id);

    if (!travel) {
      return null;
    }

    return Travel.restore(
      travel.id as number,
      travel.departure_date,
      travel.arrival_date,
      travel.bus_seat,
      travel.price,
      travel.distance_km,
      travel.duration,
      travel.available_seats,
      travel.id_busStation_departureLocation,
      travel.id_busStation_arrivalLocation
    );
  }

  public async create(travel: Travel): Promise<Travel> {
    travel.id = Math.round(Math.random() * 1000);

    this.travels.push(travel);

    return travel;
  }

  public async delete(id: number): Promise<Travel> {
    const travelIndex = this.travels.findIndex((travel) => travel.id === id);

    const travel = this.travels[travelIndex];

    this.travels.splice(travelIndex, 1);

    return travel;
  }
}

export { InMemoryTravelRepository };
