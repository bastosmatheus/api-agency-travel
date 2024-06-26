import { User } from "@/core/entities/user";

interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findByTelephone(telephone: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, name: string): Promise<User>;
  updateTelephone(id: number, telephone: string): Promise<User>;
  updatePasswordUser(id: number, password: string): Promise<User>;
  delete(id: number): Promise<User>;
}

export { UserRepository };
