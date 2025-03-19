import { Router } from "@solidjs/router"
import { createSignal } from "solid-js"
const routes = (await import("syo:routes")).default
const [routesSignal, _setRoutes] = createSignal(routes)

export default () => <Router>{
  routesSignal()
}</Router>
