import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { DatabaseConnection } from "../database/database-connection";
import { HttpServer } from "../http/http-server";
import { TravelRepositoryDatabase } from "../repositories/travel-repository-database";
import {
  CreateTravel,
  DeleteTravel,
  FindTravelById,
  FindTravels,
  FindTravelsByDepartureDate,
  FindTravelsByDestinationCity,
  FindTravelsByOriginCity,
} from "@/application/use-cases/travel";
import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { BusStationRepositoryDatabase } from "../repositories/bus-station-repository-database";
import { Fetch } from "../fetch/fetch";
import { TravelController } from "@/adapters/controllers/travel-controller";

class TravelRoutes {
  private travelRepository: TravelRepository;
  private busStationRepository: BusStationRepository;

  constructor(
    private databaseConnection: DatabaseConnection,
    private httpServer: HttpServer,
    private fetch: Fetch
  ) {
    this.travelRepository = new TravelRepositoryDatabase(this.databaseConnection);
    this.busStationRepository = new BusStationRepositoryDatabase(this.databaseConnection);
  }

  public routes() {
    const findTravels = new FindTravels(this.travelRepository);
    const findTravelsByOriginCity = new FindTravelsByOriginCity(this.travelRepository);
    const findTravelsByDestinationCity = new FindTravelsByDestinationCity(this.travelRepository);
    const findTravelsByDepartureDate = new FindTravelsByDepartureDate(this.travelRepository);
    const findTravelById = new FindTravelById(this.travelRepository);
    const createTravel = new CreateTravel(
      this.travelRepository,
      this.busStationRepository,
      this.fetch
    );
    const deleteTravel = new DeleteTravel(this.travelRepository);

    return new TravelController(
      this.httpServer,
      findTravels,
      findTravelsByOriginCity,
      findTravelsByDestinationCity,
      findTravelsByDepartureDate,
      findTravelById,
      createTravel,
      deleteTravel
    );
  }
}

export { TravelRoutes };
