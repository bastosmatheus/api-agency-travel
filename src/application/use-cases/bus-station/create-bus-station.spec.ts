import { InMemoryBusStationRepository } from "@/infra/repositories/in-memory/in-memory-bus-station-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateBusStation } from "./create-bus-station";
import { FetchAdapter } from "@/infra/fetch/fetch";
import { BadRequestError } from "../errors/bad-request-error";
import { ConflictError } from "../errors/conflict-error";

function setup() {
  const busStationRepository = new InMemoryBusStationRepository();

  const fetch = new FetchAdapter();

  const createBusStation = new CreateBusStation(busStationRepository, fetch);

  return { createBusStation };
}

let useCases: ReturnType<typeof setup>;

describe("create a new bus station", () => {
  beforeEach(() => {
    useCases = setup();
  });

  it("should be possible to create a bus station", async () => {
    const { createBusStation } = useCases;

    const busStation = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    expect(busStation.isSuccess()).toBe(true);
  });

  it("should not be possible to create if the establishment is not bus station", async () => {
    const { createBusStation } = useCases;

    const busStation = await createBusStation.execute({
      name: "Hamburgão",
      city: "São Paulo",
      uf: "SP",
    });

    expect(busStation.isFailure()).toBe(true);
    expect(busStation.value).toBeInstanceOf(BadRequestError);
  });

  it("should not be possible to create if the bus station already exists", async () => {
    const { createBusStation } = useCases;

    await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    const busStation = await createBusStation.execute({
      name: "Rodoviária do Tiête",
      city: "São Paulo",
      uf: "SP",
    });

    expect(busStation.isFailure()).toBe(true);
    expect(busStation.value).toBeInstanceOf(ConflictError);
  });

  it("should not be possible to create if the bus station does not exist", async () => {
    const { createBusStation } = useCases;

    const busStation = await createBusStation.execute({
      name: "Lugar que não existe",
      city: "São Paulo",
      uf: "SP",
    });

    expect(busStation.isFailure()).toBe(true);
    expect(busStation.value).toBeInstanceOf(BadRequestError);
  });
});
