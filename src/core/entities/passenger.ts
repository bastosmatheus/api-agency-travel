class Passenger {
  private constructor(
    public id: number | null,
    public seat: number,
    public payment: string,
    public id_travel: number,
    public id_user: number
  ) {}

  static create(seat: number, payment: string, id_travel: number, id_user: number) {
    return new Passenger(null, seat, payment, id_travel, id_user);
  }

  static restore(id: number, seat: number, payment: string, id_travel: number, id_user: number) {
    return new Passenger(id, seat, payment, id_travel, id_user);
  }

  public cancelTravel(exitDate: Date, currentDate: Date) {
    const exitTime = exitDate.getTime();
    const currentTime = currentDate.getTime();

    if (currentDate > exitDate) {
      return false;
    }

    const diffInMs = Math.abs(currentTime - exitTime);

    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return diffInHours >= 1 ? true : false;
  }
}

export { Passenger };
