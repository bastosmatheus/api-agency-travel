import { PassengerRepository } from "@/adapters/repositories/passenger-repository";
import { DatabaseConnection } from "../database/database-connection";
import { HttpServer } from "../http/http-server";
import { PassengerRepositoryDatabase } from "../repositories/passenger-repository-database";
import {
  CancelTravel,
  CreatePassenger,
  FindPassengerById,
  FindPassengers,
} from "@/application/use-cases/passenger";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { UserRepository } from "@/adapters/repositories/user-repository";
import { TravelRepositoryDatabase } from "../repositories/travel-repository-database";
import { UserRepositoryDatabase } from "../repositories/user-repository-database";
import { PassengerController } from "@/adapters/controllers/passenger-controller";

class PassengerRoutes {
  private passengerRepository: PassengerRepository;
  private travelRepository: TravelRepository;
  private userRepository: UserRepository;

  constructor(private databaseConnection: DatabaseConnection, private httpServer: HttpServer) {
    this.passengerRepository = new PassengerRepositoryDatabase(this.databaseConnection);
    this.travelRepository = new TravelRepositoryDatabase(this.databaseConnection);
    this.userRepository = new UserRepositoryDatabase(this.databaseConnection);
  }

  public routes() {
    const findPassengers = new FindPassengers(this.passengerRepository);
    const findPassengerById = new FindPassengerById(this.passengerRepository);
    const createPassenger = new CreatePassenger(
      this.passengerRepository,
      this.travelRepository,
      this.userRepository
    );
    const cancelTravel = new CancelTravel(this.passengerRepository, this.travelRepository);

    return new PassengerController(
      this.httpServer,
      findPassengers,
      findPassengerById,
      createPassenger,
      cancelTravel
    );
  }
}

export { PassengerRoutes };
