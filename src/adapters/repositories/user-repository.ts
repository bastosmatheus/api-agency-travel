import { User } from "../../core/entities/user";

interface UserRepository {
  findAll(): Promise<User[]>;
  findTravels(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(
    name: string,
    email: string,
    cpf: string,
    telephone: string,
    isAdmin: boolean
  ): Promise<User>;
  update(id: number, name: string, telephone: string): Promise<User>;
  delete(id: number): Promise<User>;
}

export { UserRepository };
