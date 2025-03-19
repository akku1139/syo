import App from "./App.tsx"
// import { hydrate } from "solid-js/web"

// hydrate(App, document)

import { render } from 'solid-js/web'

const root = document.getElementById('root')

render(() => <App />, root!)
