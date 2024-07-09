import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { FindBusStationsByCity } from "./find-bus-stations-by-city";

function setup() {
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const findBusStationsByCity = new FindBusStationsByCity(busStationRepository);

  return { createBusStation, findBusStationsByCity };
}

let useCases: ReturnType<typeof setup>;

describe("find bus stations by city", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find all bus stations by city", async () => {
    const { createBusStation, findBusStationsByCity } = useCases;

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
