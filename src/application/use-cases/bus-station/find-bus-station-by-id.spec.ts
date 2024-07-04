import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { NotFoundError } from "../errors/not-found-error";
import { FindBusStationById } from "./find-bus-station-by-id";

let busStationRepository: InMemoryBusStationRepository;
let createBusStation: CreateBusStation;
let fetch: FetchAdapter;
let findBusStationById: FindBusStationById;

describe("find bus station by id", () => {
  beforeEach(() => {
    busStationRepository = new InMemoryBusStationRepository();
    fetch = new FetchAdapter();
    createBusStation = new CreateBusStation(busStationRepository, fetch);
    findBusStationById = new FindBusStationById(busStationRepository);
  });

  it("should be possible to find a bus station by id", async () => {
    const busStationCreated = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    if (busStationCreated.isFailure()) return;

    const id = busStationCreated.value.id as number;

    const busStation = await findBusStationById.execute({ id });

    expect(busStation.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the bus station is not found", async () => {
    await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    const busStation = await findBusStationById.execute({ id: 1234567890 });

    expect(busStation.isFailure()).toBe(true);
    expect(busStation.value).toBeInstanceOf(NotFoundError);
  });
});
