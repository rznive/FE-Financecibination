import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import DashboardPage from "./pages/dashboardPage";
import MutasiPage from "./pages/mutasiPage";
import AccountsPage from "./pages/accountsPage";
import TotalTransactionPage from "./pages/totalTransactionPage";
import TransferPage from "./pages/TransferPage";
import ProtectedRoute from "./middleware/protectedRoute";

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
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/showMutasi",
    element: (
      <ProtectedRoute>
        <MutasiPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/showAccounts",
    element: (
      <ProtectedRoute>
        <AccountsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/totalTransaction",
    element: (
      <ProtectedRoute>
        <TotalTransactionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/riwayatTransfer",
    element: (
      <ProtectedRoute>
        <TransferPage />
      </ProtectedRoute>
    ),
  },
];

export default RouteList;
