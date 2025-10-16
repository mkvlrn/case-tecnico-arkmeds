import { jest } from "@jest/globals";
import type { Request, Response } from "express";
import { mockDeep } from "jest-mock-extended";

export function createControllerMocks<TController, TDeps extends unknown[]>(
  ControllerClass: new (...deps: TDeps) => TController,
  ...deps: { [K in keyof TDeps]: TDeps[K] }
) {
  const req = mockDeep<Request>();
  const res = mockDeep<Response>();
  const next = jest.fn();

  res.status.mockImplementation(() => res);
  res.json.mockImplementation(() => res);

  const controller = new ControllerClass(...deps);

  return { controller, req, res, next };
}
