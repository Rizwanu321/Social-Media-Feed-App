import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Feeds from "./components/Feeds";
import Login from "./components/Login";
import ImageSelection from "./components/ImageSelection";
import PostPreview from "./components/PostPreview";
import PostDetail from "./components/PostDetail";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

const App = () => (
  <AuthProvider>
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feeds />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route
          path="/image-selection"
          element={
            <ProtectedRoute>
              <ImageSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-preview"
          element={
            <ProtectedRoute>
              <PostPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
