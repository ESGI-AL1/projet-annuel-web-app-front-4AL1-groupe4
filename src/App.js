import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/notFound";
import ForgotPassword from './pages/ForgotPassword';
import Profile from "./pages/profile";
import MyEditor from "./pages/MyEditor";
import Programmes from "./pages/Programmes";
import Pipeline from "./pages/Pipeline";


import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './contexts/UserContext';
import CreateGroupePage from "./pages/CreateGroupePage";
import GroupePage from "./pages/GroupePage";
import {initializeUsers} from "./utils/initializeUsers";
import ChatPage from "./pages/ChatPage";
import  "./i18n"
import UsersPage from "./pages/usersPage";

function App() {
  useEffect(() => {
    initializeUsers();
  }, []);
  return (
      <div className="bg-gray-100">
        <UserProvider>

          <Router>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />



              <Route element={<PrivateRoute />}>
                <Route path="" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editor" element={<MyEditor />} />
                <Route path="/programmes" element={<Programmes />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/createGroupe" element={<CreateGroupePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/listFriends" element={<UsersPage />} />
                <Route path="/groupePage" element={<GroupePage />} />
                <Route path="/groupePage/:id" element={<GroupePage />} />
              </Route>

              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>

        </UserProvider>
      </div>

  );
}

export default App;
