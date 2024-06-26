class Travel {
  private constructor(
    public id: number | null,
    public originCity: string,
    public exitDate: Date,
    public exitLocation: string,
    public destinationCity: string,
    public arrivalDate: Date,
    public arrivalLocation: string,
    public busSeat: string,
    public price: number,
    public availableSeats: number[]
  ) {}

  static create(
    originCity: string,
    exitDate: Date,
    exitLocation: string,
    destinationCity: string,
    arrivalDate: Date,
    arrivalLocation: string,
    busSeat: string,
    price: number
  ) {
    const availableSeats = Travel.createSeats();

    return new Travel(
      null,
      originCity,
      exitDate,
      exitLocation,
      destinationCity,
      arrivalDate,
      arrivalLocation,
      busSeat,
      price,
      availableSeats
    );
  }

  static restore(
    id: number,
    originCity: string,
    exitDate: Date,
    exitLocation: string,
    destinationCity: string,
    arrivalDate: Date,
    arrivalLocation: string,
    busSeat: string,
    price: number,
    availableSeats: number[]
  ) {
    return new Travel(
      id,
      originCity,
      exitDate,
      exitLocation,
      destinationCity,
      arrivalDate,
      arrivalLocation,
      busSeat,
      price,
      availableSeats
    );
  }

  static createSeats() {
    let availableSeats = [];

    for (let i = 0; i <= 46; i++) {
      availableSeats.push(i);
    }

    return availableSeats;
  }

  public updateAvailableSeats(seat: number) {
    this.availableSeats.splice(this.availableSeats[seat], 1);
  }

  public updateAvailableSeatsIfCanceled(seat: number) {
    this.availableSeats.push(seat);
  }
}

export { Travel };
