import { FetchAdapter } from "@/infra/fetch/fetch";
import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { InMemoryPassengerRepository } from "@/infra/repositories/in-memory/in-memory-passenger-repository";
import { InMemoryTravelRepository } from "@/infra/repositories/in-memory/in-memory-travel-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreatePassenger } from "./create-passenger";
import { CreateBusStation } from "../bus-station/create-bus-station";
import { CreateTravel } from "../travel/create-travel";
import { NotFoundError } from "../errors/not-found-error";
import { FindPassengerByRg } from "./find-passenger-by-rg";

function setup() {
  const passengerRepository = new InMemoryPassengerRepository();
  const travelRepository = new InMemoryTravelRepository();
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createPassenger = new CreatePassenger(passengerRepository, travelRepository);
  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const createTravel = new CreateTravel(travelRepository, busStationRepository, fetch);
  const findPassengerByRg = new FindPassengerByRg(passengerRepository);

  return {
    createPassenger,
    createBusStation,
    createTravel,
    findPassengerByRg,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find passenger by rg", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find a passenger by rg", async () => {
    const { createPassenger, createBusStation, createTravel, findPassengerByRg } = useCases;

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

    const passengerCreated = await createPassenger.execute({
      name: "Cristiano Ronaldo",
      rg: "1234567890",
      seat: 1,
      id_travel,
    });

    if (passengerCreated.isFailure()) return;

    const rg = passengerCreated.value.rg;

    const passenger = await findPassengerByRg.execute({ rg });

    expect(passenger.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the passenger is not found", async () => {
    const { createPassenger, createBusStation, createTravel, findPassengerByRg } = useCases;

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

    const passenger = await findPassengerByRg.execute({ rg: "0000111122" });

    expect(passenger.isFailure()).toBe(true);
    expect(passenger.value).toBeInstanceOf(NotFoundError);
  });
});
