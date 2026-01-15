import { BrowserRouter } from "react-router-dom";
import AppRoute from "./routes/AppRoute";
import DebugPanel from "./components/DebugPanel";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoute />
      <DebugPanel />
    </BrowserRouter>
  );
}

export default App;
