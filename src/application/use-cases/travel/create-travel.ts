import { Fetch } from "@/infra/fetch/fetch";
import { Travel } from "@/core/entities/travel";
import { NotFoundError } from "../errors/not-found-error";
import { Either, failure, success } from "@/utils/either";
import { BadRequestError } from "../errors/bad-request-error";
import { TravelRepository } from "@/adapters/repositories/travel-repository";
import { BusStationRepository } from "@/adapters/repositories/bus-station-repository";
import { ConflictError } from "../errors/conflict-error";

type CreateTravelRequest = {
  departure_date: string;
  bus_seat: string;
  price: number;
  id_busStation_departureLocation: number;
  id_busStation_arrivalLocation: number;
};

class CreateTravel {
  constructor(
    private travelRepository: TravelRepository,
    private busStationRepository: BusStationRepository,
    private fetch: Fetch
  ) {}

  public async execute({
    departure_date,
    bus_seat,
    price,
    id_busStation_departureLocation,
    id_busStation_arrivalLocation,
  }: CreateTravelRequest): Promise<
    Either<NotFoundError | ConflictError | BadRequestError, Travel>
  > {
    if (id_busStation_departureLocation === id_busStation_arrivalLocation) {
      return failure(
        new ConflictError(`O local de destino não pode ser o mesmo que o local de saída`)
      );
    }

    const departureBusStationExists = await this.busStationRepository.findById(
      id_busStation_departureLocation
    );

    if (!departureBusStationExists) {
      return failure(
        new NotFoundError(
          `Nenhuma rodoviária encontrada com o ID: ${id_busStation_departureLocation}`
        )
      );
    }

    const arrivalBusStationExists = await this.busStationRepository.findById(
      id_busStation_arrivalLocation
    );

    if (!arrivalBusStationExists) {
      return failure(
        new NotFoundError(
          `Nenhuma rodoviária encontrada com o ID: ${id_busStation_arrivalLocation}`
        )
      );
    }

    const departure_dateValid =
      new Date(departure_date) >
      new Date(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1 <= 12 ? new Date().getMonth() + 1 : 12
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}Z`
      );

    if (!departure_dateValid) {
      return failure(new BadRequestError(`A data informada é anterior ao dia de hoje`));
    }

    const response = await this.fetch.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: {
          address: departureBusStationExists.name,
        },
        destination: {
          address: arrivalBusStationExists.name,
        },
        travelMode: "TRANSIT",
        languageCode: "pt-BR",
        departureTime: departure_date,
      },
      "routes.duration,routes.distanceMeters,routes.localizedValues"
    );

    if (!response.routes) {
      return failure(new BadRequestError(`Local repetido`));
    }

    const departureDate = new Date(departure_date);
    const travelValid = response.routes[0];
    const distanceKm = Number(
      travelValid.localizedValues.distance.text.split(" ")[0].replace(",", ".")
    );
    const durationInSeconds = travelValid.duration.replace("s", "");
    const newDate = new Date(departure_date);
    // pegando o tempo de viagem total
    const timestamp = newDate.getTime() + parseInt(durationInSeconds) * 1000;
    // adicionando o tempo de viagem a hora de saida, retornando a hora de chegada
    const arrivalDate = new Date(newDate.setTime(timestamp));
    // calculando a diferença de horas entre a data de saida e a de chegada (milisegundos)
    const diffMiliseconds = Math.abs(departureDate.getTime() - arrivalDate.getTime());
    // convertendo a diferença de milisegundos p horas e minutos
    const diffHours = Math.floor(diffMiliseconds / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMiliseconds % (1000 * 60 * 60)) / (1000 * 60));

    const duration = `${diffHours}h ${diffMinutes}m`;

    const travelCreated = Travel.create(
      departureDate,
      arrivalDate,
      bus_seat,
      price,
      distanceKm,
      duration,
      id_busStation_departureLocation,
      id_busStation_arrivalLocation
    );
    const travel = await this.travelRepository.create(travelCreated);

    return success(travel);
  }
}

export { CreateTravel };
