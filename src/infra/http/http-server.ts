import cors from "cors";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";

type HttpMethods = "get" | "post" | "patch" | "put" | "delete";

type Output = {
  type: string;
  statusCode: number;
};

interface HttpServer {
  listen(port: number): void;
  on(method: HttpMethods, url: string, callback: Function): void;
}

class ExpressAdapter implements HttpServer {
  private readonly app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use((err: unknown, req: unknown, res: Response, next: unknown) => {
      if (err) {
        return res.status(400).json({
          type: 400,
          statusCode: "Bad Request",
          message: "Requisição mal formatada",
        });
      }
    });
  }

  public on(method: HttpMethods, url: string, callback: Function): void {
    this.app[method](url.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
      try {
        const output: Output = await callback(req.params, req.body);

        return res.status(output.statusCode).json(output);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({
            type: "Bad Request",
            statusCode: 400,
            message: error.message,
          });
        }

        return res.status(500).json({
          type: "Internal Server Error",
          statusCode: 500,
          message: "Servidor com problemas, aguarde um pouco",
        });
      }
    });
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`server rodando na porta: ${port}`);
    });
  }
}

export { ExpressAdapter };
