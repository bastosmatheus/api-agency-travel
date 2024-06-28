import { BuyerRepository } from "@/adapters/repositories/buyer-repository";
import { DatabaseConnection } from "../database/database-connection";
import { Buyer } from "@/core/entities/buyer";

class BuyerRepositoryDatabase implements BuyerRepository {
  constructor(private readonly databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Buyer[]> {
    const buyers = await this.databaseConnection.query("SELECT * FROM buyers", []);

    return buyers;
  }

  public async findByUser(id_user: number): Promise<Buyer[]> {
    const buyers = await this.databaseConnection.query("SELECT * FROM buyers WHERE id_user = $1", [
      id_user,
    ]);

    return buyers;
  }

  public async findById(id: number): Promise<Buyer | null> {
    const [buyer] = await this.databaseConnection.query("SELECT * FROM buyers WHERE id = $1", [id]);

    if (!buyer) {
      return null;
    }

    return Buyer.restore(buyer.id, buyer.payment, buyer.id_user, buyer.id_travel);
  }

  public async create(buyer: Buyer): Promise<Buyer> {
    const [buyerData] = await this.databaseConnection.query(
      "INSERT INTO buyers (payment, id_user, id_travel) VALUES ($1, $2, $3) RETURNING *",
      [buyer.payment, buyer.id_user, buyer.id_travel]
    );

    return buyerData;
  }
}

export { BuyerRepositoryDatabase };
