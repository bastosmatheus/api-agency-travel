import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { NotFoundError } from "../errors/not-found-error";
import { FindBusStationByName } from "./find-bus-station-by-name";

let busStationRepository: InMemoryBusStationRepository;
let createBusStation: CreateBusStation;
let fetch: FetchAdapter;
let findBusStationByName: FindBusStationByName;

describe("find bus station by name", () => {
  beforeEach(() => {
    busStationRepository = new InMemoryBusStationRepository();
    fetch = new FetchAdapter();
    createBusStation = new CreateBusStation(busStationRepository, fetch);
    findBusStationByName = new FindBusStationByName(busStationRepository);
  });

  it("should be possible to find a bus station by name", async () => {
    const busStationCreated = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    if (busStationCreated.isFailure()) return;

    const name = busStationCreated.value.name;

    const busStation = await findBusStationByName.execute({ name });

    expect(busStation.isSuccess()).toBe(true);
  });

  it("should not be possible to find if the bus station is not found", async () => {
    await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    const busStation = await findBusStationByName.execute({ name: "Lugar que não existe" });

    expect(busStation.isFailure()).toBe(true);
    expect(busStation.value).toBeInstanceOf(NotFoundError);
  });
});
