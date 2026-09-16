import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import DashboardPage from "./pages/dashboardPage";
import MutasiPage from "./pages/mutasiPage";
import AccountsPage from "./pages/accountsPage";
import AccountDetailPage from "./pages/accountDetailPage";
import TotalTransactionPage from "./pages/totalTransactionPage";
import TransferPage from "./pages/TransferPage";
import CompleteProfilePage from "./pages/completeProfilePage";
import ProtectedRoute from "./middleware/protectedRoute";
import ProfileCompleteRoute from "./middleware/profileCompleteRoute";

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
    path: "/complete-profile",
    element: (
      <ProtectedRoute>
        <CompleteProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProfileCompleteRoute>
        <DashboardPage />
      </ProfileCompleteRoute>
    ),
  },
  {
    path: "/showMutasi",
    element: (
      <ProfileCompleteRoute>
        <MutasiPage />
      </ProfileCompleteRoute>
    ),
  },
  {
    path: "/showAccounts",
    element: (
      <ProfileCompleteRoute>
        <AccountsPage />
      </ProfileCompleteRoute>
    ),
  },
  {
    path: "/accounts/:id",
    element: (
      <ProfileCompleteRoute>
        <AccountDetailPage />
      </ProfileCompleteRoute>
    ),
  },
  {
    path: "/account-detail/:id",
    element: (
      <ProfileCompleteRoute>
        <AccountDetailPage />
      </ProfileCompleteRoute>
    ),
  },
  {
    path: "/totalTransaction",
    element: (
      <ProfileCompleteRoute>
        <TotalTransactionPage />
      </ProfileCompleteRoute>
    ),
  },
  {
    path: "/riwayatTransfer",
    element: (
      <ProfileCompleteRoute>
        <TransferPage />
      </ProfileCompleteRoute>
    ),
  },
];

export default RouteList;
