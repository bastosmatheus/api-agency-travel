class Passenger {
  private constructor(public id: number | null, public name: string, public rg: string) {}

  public create(name: string, rg: string) {
    return new Passenger(null, name, rg);
  }

  public restore(id: number, name: string, rg: string) {
    return new Passenger(id, name, rg);
  }
}

export { Passenger };
