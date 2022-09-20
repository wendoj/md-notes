import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { NextApiRequest, NextApiResponse } from "next";

const applyMiddleware =
  (middleware: any) => (request: NextApiRequest, response: NextApiRequest) =>
    new Promise((resolve, reject) => {
      middleware(request, response, (result: any) =>
        result instanceof Error ? reject(result) : resolve(result)
      );
    });

const getIP = (request: NextApiRequest) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  request.ip ||
  request.headers["x-forwarded-for"] ||
  request.headers["x-real-ip"] ||
  request.connection.remoteAddress;

export const getRateLimitMiddlewares = ({
  limit = 1,
  windowMs = 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500,
} = {}) => {
  return [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
  ];
};

const middlewares = getRateLimitMiddlewares();

async function applyRateLimit(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map((middleware) => middleware(request, response))
  );
}

export default applyRateLimit;