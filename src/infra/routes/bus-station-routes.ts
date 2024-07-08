import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { DatabaseConnection } from "../database/database-connection";
import { HttpServer } from "../http/http-server";
import { Fetch } from "../fetch/fetch";
import { BusStationRepositoryDatabase } from "../repositories/bus-station-repository-database";
import {
  CreateBusStation,
  DeleteBusStation,
  FindBusStationById,
  FindBusStationByName,
  FindBusStations,
  FindBusStationsByCity,
} from "@/application/use-cases/bus-station";
import { BusStationController } from "@/adapters/controllers/bus-station-controller";

class BusStationsRoutes {
  private busStationRepository: BusStationRepository;

  constructor(
    private databaseConnection: DatabaseConnection,
    private httpServer: HttpServer,
    private fetch: Fetch
  ) {
    this.busStationRepository = new BusStationRepositoryDatabase(this.databaseConnection);
  }

  public routes() {
    const findBusStations = new FindBusStations(this.busStationRepository);
    const findBusStationsByCity = new FindBusStationsByCity(this.busStationRepository);
    const findBusStationByName = new FindBusStationByName(this.busStationRepository);
    const findBusStationById = new FindBusStationById(this.busStationRepository);
    const createBusStation = new CreateBusStation(this.busStationRepository, this.fetch);
    const deleteBusStation = new DeleteBusStation(this.busStationRepository);

    return new BusStationController(
      this.httpServer,
      findBusStations,
      findBusStationsByCity,
      findBusStationById,
      findBusStationByName,
      createBusStation,
      deleteBusStation
    );
  }
}

export { BusStationsRoutes };
