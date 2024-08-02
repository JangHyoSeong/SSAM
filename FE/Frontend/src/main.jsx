import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./main.scss";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8081/v1/";
// axios.defaults.timeout = 5000;
// axios.defaults.headers.common["Authorization"] = "Bearer AccessToken";
// axios.defaults.headers.post["Content-Type"] = "application/json";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);