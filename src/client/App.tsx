import { Router } from "@solidjs/router"
import { createSignal } from "solid-js"
import routes from "syo:routes"
// const routing = (await import("virtual:routing")).default
const [routesSignal, _setRoutes] = createSignal(routes)

export default () => <Router>{
  routesSignal()
}</Router>
