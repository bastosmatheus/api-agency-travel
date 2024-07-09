import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { Travel } from "@/core/entities/travel";
import { DatabaseConnection } from "../database/database-connection";

class TravelRepositoryDatabase implements TravelRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Travel[]> {
    const travels = await this.databaseConnection.query(
      `
      SELECT 
      travels.id,
      travels.departure_date,
      travels.arrival_date,
      travels.bus_seat,
      travels.price,
      travels.distance_km,
      travels.duration,
      departure_station.name AS departure_location,
      departure_station.city AS departure_city,
      departure_station.uf AS departure_uf,
      arrival_station.name AS arrival_location,
      arrival_station.city AS arrival_city,
      arrival_station.uf AS arrival_uf,
      travels.available_seats
      FROM travels
      INNER JOIN bus_stations AS departure_station ON travels.id_busStation_departureLocation = departure_station.id
      INNER JOIN bus_stations AS arrival_station ON travels.id_busStation_arrivalLocation = arrival_station.id
      `,
      []
    );

    return travels;
  }

  public async findByOriginCity(city: string): Promise<Travel[]> {
    const travels = await this.databaseConnection.query(
      `
      SELECT 
      travels.id,
      travels.departure_date,
      travels.arrival_date,
      travels.bus_seat,
      travels.price,
      travels.distance_km,
      travels.duration,
      departure_station.name AS departure_location,
      departure_station.city AS departure_city,
      departure_station.uf AS departure_uf,
      arrival_station.name AS arrival_location,
      arrival_station.city AS arrival_city,
      arrival_station.uf AS arrival_uf,
      travels.available_seats
      FROM travels
      INNER JOIN bus_stations AS departure_station ON travels.id_busStation_departureLocation = departure_station.id
      INNER JOIN bus_stations AS arrival_station ON travels.id_busStation_arrivalLocation = arrival_station.id
      WHERE departure_station.city = $1 AND departure_station.id = travels.id_busStation_departureLocation
      `,
      [city]
    );

    return travels;
  }

  public async findByDestinationCity(city: string): Promise<Travel[]> {
    const travels = await this.databaseConnection.query(
      `
      SELECT 
      travels.id,
      travels.departure_date,
      travels.arrival_date,
      travels.bus_seat,
      travels.price,
      travels.distance_km,
      travels.duration,
      departure_station.name AS departure_location,
      departure_station.city AS departure_city,
      departure_station.uf AS departure_uf,
      arrival_station.name AS arrival_location,
      arrival_station.city AS arrival_city,
      arrival_station.uf AS arrival_uf,
      travels.available_seats
      FROM travels
      INNER JOIN bus_stations AS departure_station ON travels.id_busStation_departureLocation = departure_station.id
      INNER JOIN bus_stations AS arrival_station ON travels.id_busStation_arrivalLocation = arrival_station.id
      WHERE arrival_station.city = $1 AND arrival_station.id = travels.id_busStation_arrivalLocation
      `,
      [city]
    );

    return travels;
  }

  public async findByDepartureDate(date: string, city: string): Promise<Travel[]> {
    const travels = await this.databaseConnection.query(
      `
      SELECT
      travels.id,
      travels.departure_date,
      travels.arrival_date,
      travels.bus_seat,
      travels.price,
      travels.distance_km,
      travels.duration,
      departure_station.name AS departure_location,
      departure_station.city AS departure_city,
      departure_station.uf AS departure_uf,
      arrival_station.name AS arrival_location,
      arrival_station.city AS arrival_city,
      arrival_station.uf AS arrival_uf,
      travels.available_seats
      FROM travels
      INNER JOIN bus_stations AS departure_station ON travels.id_busstation_departurelocation = departure_station.id
      INNER JOIN bus_stations AS arrival_station ON travels.id_busstation_arrivallocation = arrival_station.id
      WHERE departure_station.city = $2 AND EXTRACT(DAY FROM travels.departure_date) = $1;
      `,
      [new Date(date).getUTCDate(), city]
    );

    return travels;
  }

  public async findById(id: number): Promise<Travel | null> {
    const [travel] = await this.databaseConnection.query(
      `
      SELECT * FROM travels
      WHERE travels.id = $1
      `,
      [id]
    );

    if (!travel) {
      return null;
    }

    return Travel.restore(
      travel.id,
      travel.departure_date,
      travel.arrival_date,
      travel.bus_seat,
      travel.price,
      travel.distance_km,
      travel.duration,
      travel.available_seats,
      travel.id_busstation_departurelocation,
      travel.id_busstation_arrivallocation
    );
  }

  public async create(travel: Travel): Promise<Travel> {
    const [travelData] = await this.databaseConnection.query(
      "INSERT INTO travels (departure_date, arrival_date, bus_seat, price, distance_km, duration, available_seats, id_busStation_departureLocation, id_busStation_arrivalLocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        travel.departure_date,
        travel.arrival_date,
        travel.bus_seat,
        travel.price,
        travel.distance_km,
        travel.duration,
        travel.available_seats,
        travel.id_busStation_departureLocation,
        travel.id_busStation_arrivalLocation,
      ]
    );

    return travelData;
  }

  public async updateAvailableSeats(id: number, available_seats: number[]): Promise<Travel> {
    const [travel] = await this.databaseConnection.query(
      `
      UPDATE travels
      SET available_seats = $2
      WHERE id = $1
      RETURNING *
      `,
      [id, available_seats]
    );

    return travel;
  }

  public async delete(id: number): Promise<Travel> {
    const [travel] = await this.databaseConnection.query(
      "DELETE FROM travels WHERE id = $1 RETURNING *",
      [id]
    );

    return travel;
  }
}

export { TravelRepositoryDatabase };
