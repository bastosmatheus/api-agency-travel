class BusStation {
  private constructor(
    public id: number | null,
    public name: string,
    public city: string,
    public uf: string
  ) {}

  static create(name: string, city: string, uf: string) {
    return new BusStation(null, name, city, uf);
  }

  static restore(id: number, name: string, city: string, uf: string) {
    return new BusStation(id, name, city, uf);
  }
}

export { BusStation };
