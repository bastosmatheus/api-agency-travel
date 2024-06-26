import { Buyer } from "@/core/entities/buyer";

interface BuyerRepository {
  findAll(): Promise<Buyer[]>;
  findByUser(id_user: number): Promise<Buyer[]>;
  findById(id: number): Promise<Buyer | null>;
  create(buyer: Buyer): Promise<Buyer>;
}

export { BuyerRepository };
