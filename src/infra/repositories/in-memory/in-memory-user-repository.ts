import { User } from "@/core/entities/user";
import { UserRepository } from "@/adapters/repositories/user-repository";

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findById(id: number): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id as number,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id as number,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    const user = this.users.find((user) => user.cpf === cpf);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id as number,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async findByTelephone(telephone: string): Promise<User | null> {
    const user = this.users.find((user) => user.telephone === telephone);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id as number,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async create(user: User): Promise<User> {
    user.id = Math.round(Math.random() * 1000);

    this.users.push(user);

    return user;
  }

  public async update(id: number, name: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex].name = name;

    return this.users[userIndex];
  }

  public async updateTelephone(id: number, telephone: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex].telephone = telephone;

    return this.users[userIndex];
  }

  public async updatePasswordUser(id: number, password: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex].password = password;

    return this.users[userIndex];
  }

  public async delete(id: number): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    const user = this.users[userIndex];

    this.users.splice(userIndex, 1);

    return user;
  }
}

export { InMemoryUserRepository };
