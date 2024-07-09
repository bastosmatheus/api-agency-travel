import { UserRepository } from "@/adapters/repositories/user-repository";
import { DatabaseConnection } from "../database/database-connection";
import { User } from "@/core/entities/user";

class UserRepositoryDatabase implements UserRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<User[]> {
    const users = await this.databaseConnection.query(
      `
      SELECT 
      users.id, 
      users.name, 
      users.email, 
      users.cpf, 
      users.telephone,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', passengers.id,
                  'seat', passengers.seat,
                  'payment', passengers.payment,
                  'id_travel', passengers.id_travel,
                  'id_user', passengers.id_user
                )
            )
            FROM passengers
            WHERE passengers.id_user = users.id
        ), '[]'
      ) AS passengers
      FROM users`,
      []
    );

    return users;
  }

  public async findById(id: number): Promise<User | null> {
    const [user] = await this.databaseConnection.query(
      `
      SELECT
      users.id, 
      users.name, 
      users.email,
      users.password,
      users.cpf, 
      users.telephone, 
      COALESCE (
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', passengers.id,
              'seat', passengers.seat,
              'payment', passengers.payment,
              'id_travel', passengers.id_travel,
              'id_user', passengers.id_user
            )
          )
          FROM passengers
          WHERE passengers.id_user = users.id
        ), '[]'
      ) AS passengers
      FROM users 
      WHERE id = $1`,
      [id]
    );

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.databaseConnection.query(
      `
      SELECT
      users.id, 
      users.name, 
      users.email,
      users.password,
      users.cpf, 
      users.telephone, 
      COALESCE (
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', passengers.id,
              'seat', passengers.seat,
              'payment', passengers.payment,
              'id_travel', passengers.id_travel,
              'id_user', passengers.id_user
            )
          )
          FROM passengers
          WHERE passengers.id_user = users.id
        ), '[]'
      ) AS passengers
      FROM users 
      WHERE email = $1`,
      [email]
    );

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    const [user] = await this.databaseConnection.query(
      `
      SELECT
      users.id, 
      users.name, 
      users.email,
      users.password,
      users.cpf, 
      users.telephone, 
      COALESCE (
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', passengers.id,
              'seat', passengers.seat,
              'payment', passengers.payment,
              'id_travel', passengers.id_travel,
              'id_user', passengers.id_user
            )
          )
          FROM passengers
          WHERE passengers.id_user = users.id
        ), '[]'
      ) AS passengers
      FROM users 
      WHERE cpf = $1`,
      [cpf]
    );

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async findByTelephone(telephone: string): Promise<User | null> {
    const [user] = await this.databaseConnection.query(
      `
      SELECT
      users.id, 
      users.name, 
      users.email,
      users.password,
      users.cpf, 
      users.telephone, 
      COALESCE (
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', passengers.id,
              'seat', passengers.seat,
              'payment', passengers.payment,
              'id_travel', passengers.id_travel,
              'id_user', passengers.id_user
            )
          )
          FROM passengers
          WHERE passengers.id_user = users.id
        ), '[]'
      ) AS passengers
      FROM users 
      WHERE telephone = $1`,
      [telephone]
    );

    console.log(user);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.telephone,
      user.is_admin
    );
  }

  public async create(user: User): Promise<User> {
    const [userData] = await this.databaseConnection.query(
      "INSERT INTO users (name, email, password, cpf, telephone, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user.name, user.email, user.password, user.cpf, user.telephone, user.is_admin]
    );

    return userData;
  }

  public async update(id: number, name: string): Promise<User> {
    const [user] = await this.databaseConnection.query(
      "UPDATE users SET name = $2 WHERE id = $1 RETURNING *",
      [id, name]
    );

    return user;
  }

  public async updateTelephone(id: number, telephone: string): Promise<User> {
    const [user] = await this.databaseConnection.query(
      "UPDATE users SET telephone = $2 WHERE id = $1 RETURNING *",
      [id, telephone]
    );

    return user;
  }

  public async updatePasswordUser(id: number, password: string): Promise<User> {
    const [user] = await this.databaseConnection.query(
      "UPDATE users SET password = $2 WHERE id = $1 RETURNING *",
      [id, password]
    );

    return user;
  }

  public async delete(id: number): Promise<User> {
    const [user] = await this.databaseConnection.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    return user;
  }
}

export { UserRepositoryDatabase };
