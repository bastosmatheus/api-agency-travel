import { BadRequestError } from "@/application/use-cases/errors/bad-request-error";

class Travel {
  private constructor(
    public id: number | null,
    public departure_date: Date,
    public arrival_date: Date,
    public bus_seat: string,
    public price: number,
    public distance_km: number,
    public duration: string,
    public available_seats: number[],
    public id_busStation_departureLocation: number,
    public id_busStation_arrivalLocation: number
  ) {}

  static create(
    departure_date: Date,
    arrival_date: Date,
    bus_seat: string,
    price: number,
    distance_km: number,
    duration: string,
    id_busStation_departureLocation: number,
    id_busStation_arrivalLocation: number
  ) {
    const availableSeats = Travel.createSeats();

    return new Travel(
      null,
      departure_date,
      arrival_date,
      bus_seat,
      price,
      distance_km,
      duration,
      availableSeats,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation
    );
  }

  static restore(
    id: number,
    departure_date: Date,
    arrival_date: Date,
    bus_seat: string,
    price: number,
    distance_km: number,
    duration: string,
    available_seats: number[],
    id_busStation_departureLocation: number,
    id_busStation_arrivalLocation: number
  ) {
    return new Travel(
      id,
      departure_date,
      arrival_date,
      bus_seat,
      price,
      distance_km,
      duration,
      available_seats,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation
    );
  }

  static createSeats() {
    let availableSeats = [];

    for (let i = 1; i <= 46; i++) {
      availableSeats.push(i);
    }

    return availableSeats;
  }

  public updateAvailableSeats(seat: number) {
    const index = this.available_seats.findIndex((availableSeat) => availableSeat === seat);

    if (index === -1) {
      throw new BadRequestError(
        `O assento escolhido não está disponível. Assentos disponíveis: [${this.available_seats
          .sort((a, b) => a - b)
          .join(", ")}]`
      );
    }

    this.available_seats.splice(this.available_seats[index - 1], 1);
  }

  public updateAvailableSeatsIfCanceled(seat: number) {
    this.available_seats.push(seat);
  }
}

export { Travel };
