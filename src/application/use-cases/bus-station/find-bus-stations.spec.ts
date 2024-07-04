import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { FindBusStations } from "./find-bus-stations";

let busStationRepository: InMemoryBusStationRepository;
let createBusStation: CreateBusStation;
let fetch: FetchAdapter;
let findBusStations: FindBusStations;

describe("find bus stations", () => {
  beforeEach(() => {
    busStationRepository = new InMemoryBusStationRepository();
    fetch = new FetchAdapter();
    createBusStation = new CreateBusStation(busStationRepository, fetch);
    findBusStations = new FindBusStations(busStationRepository);
  });

  it("should be possible to find all bus stations", async () => {
    await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    await createBusStation.execute({
      name: "Rodoviária de Embu das Artes",
      city: "São Paulo",
      uf: "SP",
    });

    const busStation = await findBusStations.execute();

    expect(busStation.length).toBeGreaterThanOrEqual(2);
  });
});
