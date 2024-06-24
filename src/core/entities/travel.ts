class Travel {
  private constructor(
    public id: number | null,
    public originCity: string,
    public exitDate: Date,
    public exitTime: string,
    public exitLocation: string,
    public destinationCity: string,
    public arrivalDate: Date,
    public arrivalTime: string,
    public arrivalLocation: string,
    public busSeat: string,
    public price: number,
    public availableSeats: number
  ) {}

  public create(
    originCity: string,
    exitDate: Date,
    exitTime: string,
    exitLocation: string,
    destinationCity: string,
    arrivalDate: Date,
    arrivalTime: string,
    arrivalLocation: string,
    busSeat: string,
    price: number,
    availableSeats: number
  ) {
    return new Travel(
      null,
      originCity,
      exitDate,
      exitTime,
      exitLocation,
      destinationCity,
      arrivalDate,
      arrivalTime,
      arrivalLocation,
      busSeat,
      price,
      availableSeats
    );
  }

  public restore(
    id: number,
    originCity: string,
    exitDate: Date,
    exitTime: string,
    exitLocation: string,
    destinationCity: string,
    arrivalDate: Date,
    arrivalTime: string,
    arrivalLocation: string,
    busSeat: string,
    price: number,
    availableSeats: number
  ) {
    return new Travel(
      id,
      originCity,
      exitDate,
      exitTime,
      exitLocation,
      destinationCity,
      arrivalDate,
      arrivalTime,
      arrivalLocation,
      busSeat,
      price,
      availableSeats
    );
  }
}
