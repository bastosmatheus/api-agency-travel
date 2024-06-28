class User {
  private constructor(
    public id: number | null,
    public name: string,
    public email: string,
    public password: string,
    public cpf: string,
    public telephone: string,
    public is_admin: boolean = false
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
    is_admin: boolean
  ) {
    return new User(id, name, email, password, cpf, telephone, is_admin);
  }
}

export { User };
