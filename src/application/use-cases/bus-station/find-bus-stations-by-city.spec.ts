import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { FindBusStationsByCity } from "./find-bus-stations-by-city";

let busStationRepository: InMemoryBusStationRepository;
let createBusStation: CreateBusStation;
let fetch: FetchAdapter;
let findBusStationsByCity: FindBusStationsByCity;

describe("find bus stations by city", () => {
  beforeEach(() => {
    busStationRepository = new InMemoryBusStationRepository();
    fetch = new FetchAdapter();
    createBusStation = new CreateBusStation(busStationRepository, fetch);
    findBusStationsByCity = new FindBusStationsByCity(busStationRepository);
  });

  it("should be possible to find all bus stations by city", async () => {
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

    const busStation = await findBusStationsByCity.execute({ city: "São Paulo" });

    expect(busStation.length).toBeGreaterThanOrEqual(2);
  });
});
