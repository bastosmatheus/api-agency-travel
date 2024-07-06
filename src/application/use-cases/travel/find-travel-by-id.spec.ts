import { FetchAdapter } from "@/infra/fetch/fetch";
import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { InMemoryTravelRepository } from "@/infra/repositories/in-memory/in-memory-travel-repository";
import { CreateBusStation } from "../bus-station/create-bus-station";
import { CreateTravel } from "./create-travel";
import { describe, it, expect, beforeEach } from "vitest";
import { NotFoundError } from "../errors/not-found-error";
import { FindTravelById } from "./find-travel-by-id";

function setup() {
  const travelRepository = new InMemoryTravelRepository();
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const createTravel = new CreateTravel(travelRepository, busStationRepository, fetch);
  const findTravelById = new FindTravelById(travelRepository);

  return {
    createBusStation,
    createTravel,
    findTravelById,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find travel by id", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find a travel by id", async () => {
    const { createTravel, createBusStation, findTravelById } = useCases;

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

    const travelCreated = await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    if (travelCreated.isFailure()) return;

    const id = travelCreated.value.id as number;

    const travel = await findTravelById.execute({ id });

    expect(travel.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the travel is not found", async () => {
    const { createTravel, createBusStation, findTravelById } = useCases;

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

    const travel = await findTravelById.execute({ id: 112390183291 });

    expect(travel.isFailure()).toBe(true);
    expect(travel.value).toBeInstanceOf(NotFoundError);
  });
});
