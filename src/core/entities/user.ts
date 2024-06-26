class User {
  private constructor(
    public id: number | null,
    public name: string,
    public email: string,
    public password: string,
    public cpf: string,
    public telephone: string,
    public isAdmin: boolean = false
  ) {}

  static create(name: string, email: string, password: string, cpf: string, telephone: string) {
    return new User(null, name, email, password, cpf, telephone);
  }

  static restore(
    id: number,
    name: string,
    email: string,
    password: string,
    cpf: string,
    telephone: string,
    isAdmin: boolean
  ) {
    return new User(id, name, email, password, cpf, telephone, isAdmin);
  }
}

export { User };
