import pg from "pg-promise/typescript/pg-subset";
import pgp from "pg-promise";
import { configDotenv } from "dotenv";

const env = configDotenv();

interface DatabaseConnection {
  query(queryString: string, params: unknown[]): Promise<any>;
}

class PgPromiseAdapter implements DatabaseConnection {
  private readonly connection: pgp.IDatabase<{}, pg.IClient>;

  constructor() {
    this.connection = pgp()(process.env.DATABASE_URL as string);
  }

  public async query(queryString: string, params: unknown[]) {
    const query = await this.connection.query(queryString, params);

    return query;
  }
}

export { PgPromiseAdapter, DatabaseConnection };
