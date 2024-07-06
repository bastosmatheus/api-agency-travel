import { FetchAdapter } from "@/infra/fetch/fetch";
import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { InMemoryTravelRepository } from "@/infra/repositories/in-memory/in-memory-travel-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateBusStation } from "../bus-station/create-bus-station";
import { CreateTravel } from "./create-travel";
import { FindTravelsByOriginCity } from "./find-travels-by-origin-city";
import { FindBusStations } from "../bus-station/find-bus-stations";

function setup() {
  const travelRepository = new InMemoryTravelRepository();
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const createTravel = new CreateTravel(travelRepository, busStationRepository, fetch);
  const findTravelsByOriginCity = new FindTravelsByOriginCity(travelRepository);
  const findBusStations = new FindBusStations(busStationRepository);

  return {
    createBusStation,
    createTravel,
    findTravelsByOriginCity,
    findBusStations,
    travelRepository,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find travels by origin city", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find all travels by origin city", async () => {
    const {
      createTravel,
      createBusStation,
      findTravelsByOriginCity,
      findBusStations,
      travelRepository,
    } = useCases;

    const busStationDeparture = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    if (busStationDeparture.isFailure()) return;

    const id_busStation_departureLocation = busStationDeparture.value.id as number;

    const busStationArrival = await createBusStation.execute({
      name: "Rodoviária de Vila Velha",
      city: "Vila Velha",
      uf: "ES",
    });

    if (busStationArrival.isFailure()) return;

    const id_busStation_arrivalLocation = busStationArrival.value.id as number;

    await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Semi-leito",
      price: 300,
      id_busStation_departureLocation: id_busStation_arrivalLocation,
      id_busStation_arrivalLocation: id_busStation_departureLocation,
    });

    await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Cama",
      price: 500,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    const busStations = await findBusStations.execute();

    travelRepository.addBusStation(busStations);

    const travels = await findTravelsByOriginCity.execute({ city: "São Paulo" });

    expect(travels.length).toBeGreaterThanOrEqual(2);
  });
});
