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
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { CreateUser } from "../user";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";

function setup() {
  const passengerRepository = new InMemoryPassengerRepository();
  const travelRepository = new InMemoryTravelRepository();
  const busStationRepository = new InMemoryBusStationRepository();
  const userRepository = new InMemoryUserRepository();

  const fetch = new FetchAdapter();
  const cryptography = new BcryptAdapter();

  const createPassenger = new CreatePassenger(
    passengerRepository,
    travelRepository,
    userRepository
  );
  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const createTravel = new CreateTravel(travelRepository, busStationRepository, fetch);
  const createUser = new CreateUser(userRepository, cryptography);

  return {
    createPassenger,
    createBusStation,
    createTravel,
    createUser,
  };
}

let useCases: ReturnType<typeof setup>;

describe("create a new passenger", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to create a passenger", async () => {
    const { createPassenger, createBusStation, createTravel, createUser } = useCases;

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

    if (travel.isFailure()) return;

    const id_travel = travel.value.id as number;

    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id as number;

    const passenger = await createPassenger.execute({
      seat: 1,
      payment: "Cartão",
      id_travel,
      id_user,
    });

    expect(passenger.isSuccess()).toBe(true);
  });

  it("should not be possible to create a passenger if the travel is not found", async () => {
    const { createPassenger, createBusStation, createTravel, createUser } = useCases;

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

    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id as number;

    const passenger = await createPassenger.execute({
      seat: 1,
      payment: "Cartão",
      id_travel: 1239081391829,
      id_user,
    });

    expect(passenger.isFailure()).toBe(true);
    expect(passenger.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create if the user is not found", async () => {
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
      departure_date: new Date("2024-07-10 20:00:00Z"),
      bus_seat: "Leito",
      price: 150,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation,
    });

    if (travel.isFailure()) return;

    const id_travel = travel.value.id as number;

    const passenger = await createPassenger.execute({
      seat: 1,
      payment: "Cartão",
      id_travel,
      id_user: 218397198,
    });

    expect(passenger.isFailure()).toBe(true);
    expect(passenger.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create a passenger if the seat is unavailable", async () => {
    const { createPassenger, createBusStation, createTravel, createUser } = useCases;

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

    if (travel.isFailure()) return;

    const id_travel = travel.value.id as number;

    const user = await createUser.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345678",
      cpf: "12345678910",
      telephone: "11977778888",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id as number;

    await createPassenger.execute({
      seat: 1,
      payment: "Cartão",
      id_travel,
      id_user,
    });

    await expect(async () => {
      await createPassenger.execute({
        seat: 1,
        payment: "Cartão",
        id_travel,
        id_user,
      });
    }).rejects.toBeInstanceOf(BadRequestError);
  });
});
