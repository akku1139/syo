import { Router } from "@solidjs/router"
import { HydrationScript, isServer } from "solid-js/web"
// import { type RouteDefinition } from "@solidjs/router"
// import { createSignal } from "solid-js"
import routes from "syo:routes"
import type { App } from "../node/types.ts"

// https://github.com/farm-fe/farm/issues/2125
// const routes = (await import("syo:routes")).default

// const [routesSignal, _setRoutes] = createSignal<Array<RouteDefinition>>(routes)

//const mod = (await routes[0].component).default
//export default () => mod

export default ((props?: { url?: string, base?: string }) =>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Syo</title>
    <HydrationScript />
  </head>
  <body>
    <div id="root">
      <Router url={isServer ? props?.url : ""} base={props?.base} >{
        // routesSignal() // Uncaught TypeError: Comp is not a function
        routes
      }</Router>
    </div>
    <script src="./entry.tsx" type="module" defer />
  </body>
</html>) satisfies App
