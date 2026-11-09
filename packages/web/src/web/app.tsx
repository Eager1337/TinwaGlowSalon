import { Route, Switch } from "wouter";
import Home from './pages/home';
import Studio from './pages/studio';
import Privacy from './pages/privacy';
import './salon.css';
import './refinements.css';
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/studio"><Studio demo /></Route>
        <Route path="/owner"><Studio /></Route>
        <Route path="/privacy" component={Privacy} />
        <Route><main className="legal-page"><h1>A little detour.</h1><p>This page isn’t here.</p><a href="/">Back to your glow</a></main></Route>
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
