import { Buyer } from "../../core/entities/buyer";

interface BuyerRepository {
  findAll(): Promise<Buyer[]>;
  findByUser(id_user: number): Promise<Buyer[]>;
  findById(id: number): Promise<Buyer | null>;
  create(id_user: number, id_travel: number): Promise<Buyer>;
  updateTravel(id_travel: number): Promise<Buyer>;
}

export { BuyerRepository };
