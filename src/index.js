import ApnaReact, { createRoot } from "../apna-react";
import App from "./components/App";
import "../index.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
