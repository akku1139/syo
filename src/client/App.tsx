import { Router } from "@solidjs/router"
// import { type RouteDefinition } from "@solidjs/router"
// import { createSignal } from "solid-js"
import routes from "syo:routes"

// https://github.com/farm-fe/farm/issues/2125
// const routes = (await import("syo:routes")).default

// const [routesSignal, _setRoutes] = createSignal<Array<RouteDefinition>>(routes)

console.log("routes", routes)

export default () => <Router>{
  // routesSignal()
  routes
}</Router>

//const mod = (await routes[0].component).default
//export default () => mod
