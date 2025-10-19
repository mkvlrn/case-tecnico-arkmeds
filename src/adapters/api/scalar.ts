import { apiReference } from "@scalar/express-api-reference";

export function getScalarMiddleware(apiEnv: "dev" | "prod") {
  const servers = {
    dev: {
      url: "http://localhost:4000",
      description: "localhost - dev server",
    },
    prod: {
      url: "https://case-tecnico-arkmeds-mkvlrn.up.railway.app",
      description: "railway - prod server",
    },
  };

  return apiReference({
    url: "/openapi.json",
    theme: "moon",
    layout: "modern",
    darkMode: true,
    hideModels: true,
    hideClientButton: true,
    forceDarkModeState: "dark",
    pageTitle: "Case Técnico Arkmeds - mkvlrn@gmail.com - API docs",
    servers: [servers[apiEnv]],
  });
}
