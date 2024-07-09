import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { NotFoundError } from "../errors/not-found-error";
import { FindBusStationById } from "./find-bus-station-by-id";

function setup() {
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);
  const findBusStationById = new FindBusStationById(busStationRepository);

  return { createBusStation, findBusStationById };
}

let useCases: ReturnType<typeof setup>;

describe("find bus station by id", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to find a bus station by id", async () => {
    const { createBusStation, findBusStationById } = useCases;

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
    const { createBusStation, findBusStationById } = useCases;

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
