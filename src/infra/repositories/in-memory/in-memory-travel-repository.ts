import { Travel } from "@/core/entities/travel";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { BusStation } from "@/core/entities/bus-station";

class InMemoryTravelRepository implements TravelRepository {
  private travels: Travel[] = [];
  private busStations: BusStation[] = [];

  public async findAll(): Promise<Travel[]> {
    return this.travels;
  }

  public async findByOriginCity(city: string): Promise<Travel[]> {
    const busStations = this.busStations.filter((busStation) => busStation.city === city);

    let travelsValids: Travel[] = [];

    this.travels.filter((travel) => {
      busStations.forEach((busStation) => {
        if (busStation.id === travel.id_busStation_departureLocation) travelsValids.push(travel);
      });
    });

    return travelsValids;
  }

  public async findByDestinationCity(city: string): Promise<Travel[]> {
    const busStations = this.busStations.filter((busStation) => busStation.city === city);

    let travelsValids: Travel[] = [];

    this.travels.filter((travel) => {
      busStations.forEach((busStation) => {
        if (busStation.id === travel.id_busStation_arrivalLocation) travelsValids.push(travel);
      });
    });

    return travelsValids;
  }

  public async findByDepartureDate(date: Date, city: string): Promise<Travel[]> {
    const busStations = this.busStations.filter((busStation) => busStation.city === city);

    let travelsValids: Travel[] = [];

    this.travels.filter((travel) => {
      busStations.forEach((busStation) => {
        if (
          busStation.id === travel.id_busStation_departureLocation &&
          travel.departure_date.getDay() === date.getDay()
        )
          travelsValids.push(travel);
      });
    });

    return travelsValids;
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

  public async addBusStation(busStations: BusStation[]) {
    busStations.forEach((busStation) => this.busStations.push(busStation));
  }
}

export { InMemoryTravelRepository };
