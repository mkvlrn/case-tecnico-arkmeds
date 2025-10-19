import { apiReference } from "@scalar/express-api-reference";

export function getScalarMiddleware(apiEnv: "dev" | "prod") {
  const url =
    apiEnv === "dev"
      ? "http://localhost:4000"
      : "https://case-tecnico-arkmeds-mkvlrn.up.railway.app";
  const description = apiEnv === "dev" ? "localhost - dev server" : "railway - prod server";
  const servers = [{ url, description }];

  return apiReference({
    url: "/openapi.json",
    theme: "moon",
    layout: "modern",
    darkMode: true,
    hideModels: true,
    hideClientButton: true,
    forceDarkModeState: "dark",
    pageTitle: "Case Técnico Arkmeds - mkvlrn@gmail.com - API docs",
    servers,
  });
}
