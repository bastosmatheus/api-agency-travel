interface TravelRepository {
  findAll(): Promise<Travel[]>;
  findByOriginCity(city: string): Promise<Travel[]>;
  findByDestinationCity(city: string): Promise<Travel[]>;
  findByExitLocation(location: string): Promise<Travel[]>;
  findByArrivalLocation(location: string): Promise<Travel[]>;
  findByExitTime(time: string): Promise<Travel[]>;
  findByExitDate(date: Date): Promise<Travel[]>;
  findById(id: number): Promise<Travel | null>;
  create(
    originCity: string,
    exitDate: Date,
    exitTime: string,
    exitLocation: string,
    destinationCity: string,
    arrivalDate: Date,
    arrivalLocation: string,
    busSeat: string,
    price: number,
    availableSeats: number
  ): Promise<Travel>;
  updateAvailableSeats(id: number): Promise<Travel>;
  delete(id: number): Promise<Travel>;
}
