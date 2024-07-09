import { JwtAdapter } from "@/infra/token/token";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

class AdminMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    const jwt = new JwtAdapter();

    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
      return res.status(400).json({
        type: "Bad Request",
        statusCode: 400,
        message: "Informe o token de autenticação",
      });
    }

    const token = bearerToken.split(" ")[1];

    const verify = await jwt.verify(token);

    if (verify instanceof TokenExpiredError) {
      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: "Token expirado, faça o login novamente",
      });
    }

    if (verify instanceof JsonWebTokenError) {
      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: "Token inválido ou mal formatado",
      });
    }

    if (!verify.is_admin) {
      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: "Apenas admins podem executar essa ação",
      });
    }

    next();
  }
}

export { AdminMiddleware };
