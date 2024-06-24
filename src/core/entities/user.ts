class User {
  private constructor(
    public id: number | null,
    public name: string,
    public email: string,
    public cpf: string,
    public telephone: string,
    public isAdmin: boolean
  ) {}

  public create(name: string, email: string, cpf: string, telephone: string, isAdmin: boolean) {
    return new User(null, name, email, cpf, telephone, isAdmin);
  }

  public restore(
    id: number,
    name: string,
    email: string,
    cpf: string,
    telephone: string,
    isAdmin: boolean
  ) {
    return new User(id, name, email, cpf, telephone, isAdmin);
  }
}

export { User };
