import { Routes, Route } from "react-router-dom";
import RouteList from "./routeList"; // Import RouteList dari routeList.jsx

function App() {
  return (
    <Routes>
      {RouteList.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;
