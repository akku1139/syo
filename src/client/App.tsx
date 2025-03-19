import { Router } from "@solidjs/router"
import { createSignal } from "solid-js"
const [routes, _setRoutes] = createSignal((await import("virtual:router")).default)

export default () => <Router>{
  routes()
}</Router>
