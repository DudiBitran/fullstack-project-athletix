import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate } from "react-router-dom";
import CustomNavbar from "./components/navbar";
import HomePage from "./pages/homePage";
import Footer from "./components/footer";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";
import About from "./pages/about";
import UserProfileSettings from "./pages/userDashboard/userProfileSettings";
import CreateProgram from "./pages/trainerDashboard/createProgram";
import UpdateProgram from "./pages/trainerDashboard/updateProgram";
import MyClients from "./pages/trainerDashboard/myClients";
import MyPrograms from "./pages/trainerDashboard/myPrograms";
import CreateExercise from "./pages/trainerDashboard/createExercise";
import MyExercises from "./pages/trainerDashboard/myExercises";
import AddExercisesToDay from "./components/common/addExerciseToDay";
import ProgramViewPage from "./pages/trainerDashboard/programView";
import ProtectedTrainerRoute from "./components/common/ProtectedTrainerRoute";
import ProtectedUserRoute from "./components/common/ProtectedUserRoute";
import { ToastContainer } from "react-toastify";
import MyProgram from "./pages/userDashboard/MyProgram";
import ClientAnalytics from "./pages/trainerDashboard/ClientAnalytics";
import { useAuth } from "./context/auth.context";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditExercise from "./pages/trainerDashboard/editExercise";
import ViewExercise from "./pages/trainerDashboard/viewExercise";
import AdminPanel from "./pages/adminDashboard/AdminPanel";
import UserDetails from "./pages/adminDashboard/UserDetails";
import EditUser from "./pages/adminDashboard/EditUser";

function App() {
  const { user } = useAuth();
  return (
    <div className="app-layout">
      <header>
        <CustomNavbar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              user && user.role === "trainer" ? (
                <Navigate to="/" />
              ) : user && user.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <ProtectedUserRoute>
                  <MyProgram />
                </ProtectedUserRoute>
              )
            }
          />
          <Route
            path="/profile-settings"
            element={
              <ProtectedUserRoute>
                <UserProfileSettings />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/trainer/create-program"
            element={
              <ProtectedTrainerRoute>
                <CreateProgram />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/update-program/:programId"
            element={
              <ProtectedTrainerRoute>
                <UpdateProgram />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/my-customers"
            element={
              <ProtectedTrainerRoute>
                <MyClients />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/my-programs"
            element={
              <ProtectedTrainerRoute>
                <MyPrograms />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/create-exercise"
            element={
              <ProtectedTrainerRoute>
                <CreateExercise />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/my-exercises"
            element={
              <ProtectedTrainerRoute>
                <MyExercises />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/add-exercise"
            element={
              <ProtectedTrainerRoute>
                <AddExercisesToDay />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/program/:programId"
            element={
              <ProtectedTrainerRoute>
                <ProgramViewPage />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/client-analytics/:userId"
            element={
              <ProtectedTrainerRoute>
                <ClientAnalytics />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/edit-exercise/:id"
            element={
              <ProtectedTrainerRoute>
                <EditExercise />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/trainer/view-exercise/:id"
            element={
              <ProtectedTrainerRoute>
                <ViewExercise />
              </ProtectedTrainerRoute>
            }
          />
          <Route
            path="/admin"
            element={user && user.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />}
          />
          <Route path="/admin/users/:userId" element={<UserDetails />} />
          <Route path="/admin/users/:userId/edit" element={<EditUser />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
