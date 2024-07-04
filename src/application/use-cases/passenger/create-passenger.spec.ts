import { describe, it, expect, beforeEach } from "vitest";
import { CreatePassenger } from "./create-passenger";
import { InMemoryTravelRepository } from "@/infra/repositories/in-memory/in-memory-travel-repository";
import { InMemoryPassengerRepository } from "@/infra/repositories/in-memory/in-memory-passenger-repository";
import { CreateBusStation } from "../bus-station/create-bus-station";
import { CreateTravel } from "../travel/create-travel";
import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";
import { BadRequestError } from "../errors/bad-request-error";

function setup() {
  const passengerRepository = new InMemoryPassengerRepository();
  const travelRepository = new InMemoryTravelRepository();
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createPassenger = new CreatePassenger(passengerRepository, travelRepository);
  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const createTravel = new CreateTravel(travelRepository, busStationRepository, fetch);

  return {
    createPassenger,
    createBusStation,
    createTravel,
  };
}

let useCases: ReturnType<typeof setup>;

describe("create a new passenger", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to create a passenger", async () => {
    const { createPassenger, createBusStation, createTravel } = useCases;

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
      departure_date: new Date("2024-07-04 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    if (travel.isFailure()) return;

    const id_travel = travel.value.id as number;

    const passenger = await createPassenger.execute({
      name: "Cristiano Ronaldo",
      rg: "1234567890",
      seat: 1,
      id_travel,
    });

    expect(passenger.isSuccess()).toBe(true);
  });

  it("should not be possible to create a passenger if the rg already exists", async () => {
    const { createPassenger, createBusStation, createTravel } = useCases;

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
      departure_date: new Date("2024-07-04 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    if (travel.isFailure()) return;

    const id_travel = travel.value.id as number;

    await createPassenger.execute({
      name: "Cristiano Ronaldo",
      rg: "1234567890",
      seat: 1,
      id_travel,
    });

    const passenger = await createPassenger.execute({
      name: "Cristiano Ronaldo",
      rg: "1234567890",
      seat: 1,
      id_travel,
    });

    expect(passenger.isFailure()).toBe(true);
    expect(passenger.value).toBeInstanceOf(ConflictError);
  });

  it("should not be possible to create a passenger if the travel is not found", async () => {
    const { createPassenger, createBusStation, createTravel } = useCases;

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
      departure_date: new Date("2024-07-04 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    const passenger = await createPassenger.execute({
      name: "Cristiano Ronaldo",
      rg: "1234567890",
      seat: 1,
      id_travel: 123081932018,
    });

    expect(passenger.isFailure()).toBe(true);
    expect(passenger.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create a passenger if the seat is unavailable", async () => {
    const { createPassenger, createBusStation, createTravel } = useCases;

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
      departure_date: new Date("2024-07-04 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    if (travel.isFailure()) return;

    const id_travel = travel.value.id as number;

    await createPassenger.execute({
      name: "Cristiano Ronaldo",
      rg: "1234567890",
      seat: 1,
      id_travel,
    });

    await expect(async () => {
      await createPassenger.execute({
        name: "Cristiano Ronaldo",
        rg: "1234567811",
        seat: 1,
        id_travel,
      });
    }).rejects.toBeInstanceOf(BadRequestError);
  });
});
