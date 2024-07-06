import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryTravelRepository } from "@/infra/repositories/in-memory/in-memory-travel-repository";
import { CreateBusStation } from "../bus-station/create-bus-station";
import { CreateTravel } from "../travel/create-travel";
import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";
import { BadRequestError } from "../errors/bad-request-error";

function setup() {
  const travelRepository = new InMemoryTravelRepository();
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const createTravel = new CreateTravel(travelRepository, busStationRepository, fetch);

  return {
    createBusStation,
    createTravel,
  };
}

let useCases: ReturnType<typeof setup>;

describe("create a new travel", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to create a travel", async () => {
    const { createBusStation, createTravel } = useCases;

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

    const travel = await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    expect(travel.isSuccess()).toBe(true);
  });

  it("should not be possible to create a travel if the departure location is not found", async () => {
    const { createBusStation, createTravel } = useCases;

    await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    const busStationArrival = await createBusStation.execute({
      name: "Rodoviária de Vila Velha",
      city: "Vila Velha",
      uf: "ES",
    });

    if (busStationArrival.isFailure()) return;

    const id_busStation_arrivalLocation = busStationArrival.value.id as number;

    const travel = await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation: 12930183912,
      id_busStation_arrivalLocation,
    });

    expect(travel.isFailure()).toBe(true);
    expect(travel.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create a travel if the arrival location is not found", async () => {
    const { createBusStation, createTravel } = useCases;

    const busStationDeparture = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    if (busStationDeparture.isFailure()) return;

    const id_busStation_departureLocation = busStationDeparture.value.id as number;

    await createBusStation.execute({
      name: "Rodoviária de Vila Velha",
      city: "Vila Velha",
      uf: "ES",
    });

    const travel = await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation: 12930183912,
    });

    expect(travel.isFailure()).toBe(true);
    expect(travel.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create a travel if the location is the same for departure and arrival", async () => {
    const { createBusStation, createTravel } = useCases;

    const busStation = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    if (busStation.isFailure()) return;

    const id_busStation = busStation.value.id as number;

    const travel = await createTravel.execute({
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation: id_busStation,
      id_busStation_arrivalLocation: id_busStation,
    });

    expect(travel.isFailure()).toBe(true);
    expect(travel.value).toBeInstanceOf(ConflictError);
  });

  it("should be possible to create a travel", async () => {
    const { createBusStation, createTravel } = useCases;

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

    const travel = await createTravel.execute({
      departure_date: new Date("2024-07-03 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    expect(travel.isFailure()).toBe(true);
    expect(travel.value).toBeInstanceOf(BadRequestError);
  });
});
