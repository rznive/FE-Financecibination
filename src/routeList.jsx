// routeList.jsx
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import DashboardPage from "./pages/dashboardPage";
import MutasiPage from "./pages/mutasiPage";

const RouteList = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/showMutasi",
    element: <MutasiPage />,
  }
];

export default RouteList;
