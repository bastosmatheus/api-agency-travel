import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { DeleteBusStation } from "./delete-bus-station";
import { NotFoundError } from "../errors/not-found-error";

let busStationRepository: InMemoryBusStationRepository;
let createBusStation: CreateBusStation;
let fetch: FetchAdapter;
let deleteBusStation: DeleteBusStation;

describe("delete a bus station", () => {
  beforeEach(() => {
    busStationRepository = new InMemoryBusStationRepository();
    fetch = new FetchAdapter();
    createBusStation = new CreateBusStation(busStationRepository, fetch);
    deleteBusStation = new DeleteBusStation(busStationRepository);
  });

  it("should be possible to delete a bus station", async () => {
    const busStationCreated = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    if (busStationCreated.isFailure()) return;

    const id = busStationCreated.value.id as number;

    const busStation = await deleteBusStation.execute({ id });

    expect(busStation.isSuccess()).toBe(true);
  });

  it("should not be possible to delete if the bus station is not found", async () => {
    await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    const busStation = await deleteBusStation.execute({ id: 1234567890 });

    expect(busStation.isFailure()).toBe(true);
    expect(busStation.value).toBeInstanceOf(NotFoundError);
  });
});
