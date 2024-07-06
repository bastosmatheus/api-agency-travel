import { FetchAdapter } from "@/infra/fetch/fetch";
import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { InMemoryPassengerRepository } from "@/infra/repositories/in-memory/in-memory-passenger-repository";
import { InMemoryTravelRepository } from "@/infra/repositories/in-memory/in-memory-travel-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreatePassenger } from "./create-passenger";
import { CreateBusStation } from "../bus-station/create-bus-station";
import { CreateTravel } from "../travel/create-travel";
import { FindPassengers } from "./find-passengers";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { BcryptAdapter } from "@/infra/cryptography/cryptography";
import { CreateUser } from "../user";

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
  const findPassengers = new FindPassengers(passengerRepository);
  const createUser = new CreateUser(userRepository, cryptography);

  return {
    createPassenger,
    createBusStation,
    createTravel,
    findPassengers,
    createUser,
  };
}

let useCases: ReturnType<typeof setup>;

describe("find passengers", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find all passengers", async () => {
    const { createPassenger, createBusStation, createTravel, findPassengers, createUser } =
      useCases;

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

    await createPassenger.execute({
      seat: 12,
      payment: "Cartão",
      id_travel,
      id_user,
    });

    const passengers = await findPassengers.execute();

    expect(passengers.length).toBeGreaterThanOrEqual(2);
  });
});
