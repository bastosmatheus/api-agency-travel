import { BcryptAdapter } from "./infra/cryptography/cryptography";
import { PgPromiseAdapter } from "./infra/database/database-connection";
import { FetchAdapter } from "./infra/fetch/fetch";
import { ExpressAdapter } from "./infra/http/http-server";
import { BusStationsRoutes } from "./infra/routes/bus-station-routes";
import { PassengerRoutes } from "./infra/routes/passenger-routes";
import { TravelRoutes } from "./infra/routes/travel-routes";
import { UserRoutes } from "./infra/routes/user-routes";
import { JwtAdapter } from "./infra/token/token";

const httpServer = new ExpressAdapter();
const cryptography = new BcryptAdapter();
const databaseConnection = new PgPromiseAdapter();
const fetch = new FetchAdapter();
const token = new JwtAdapter();

new UserRoutes(databaseConnection, httpServer, cryptography, token).routes();
new BusStationsRoutes(databaseConnection, httpServer, fetch).routes();
new TravelRoutes(databaseConnection, httpServer, fetch).routes();
new PassengerRoutes(databaseConnection, httpServer).routes();

httpServer.listen(3333);
