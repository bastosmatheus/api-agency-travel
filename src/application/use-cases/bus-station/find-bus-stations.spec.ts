import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { FindBusStations } from "./find-bus-stations";

function setup() {
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const findBusStations = new FindBusStations(busStationRepository);

  return { createBusStation, findBusStations };
}

let useCases: ReturnType<typeof setup>;

describe("find bus stations", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find all bus stations", async () => {
    const { createBusStation, findBusStations } = useCases;

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
