class Buyer {
  private constructor(
    public id: number | null,
    public payment: string,
    public id_user: number,
    public id_travel: number
  ) {}

  public create(payment: string, id_user: number, id_travel: number) {
    return new Buyer(null, payment, id_user, id_travel);
  }

  public restore(id: number, payment: string, id_user: number, id_travel: number) {
    return new Buyer(id, payment, id_user, id_travel);
  }
}

export { Buyer };
