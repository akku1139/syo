import { Router } from "@solidjs/router"
import { createSignal } from "solid-js"
import routing from "syo:routing"
// const routing = (await import("virtual:routing")).default
const [routes, _setRoutes] = createSignal(routing)

export default () => <Router>{
  routes()
}</Router>
