import { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

import Header from "./pages/Admin/Header";
import Sidebar from "./pages/Admin/Sidebar";
import Home from "./pages/Admin/Home";
import Homepage from "./pages/Public/HomePage/Homepage";
import BlogContentPage from "./pages/Public/BlogContentPage/BlogContentPage";
import SignUpPage from "./pages/Public/AuthPage/SignUpPage";
import LoginPage from "./pages/Public/AuthPage/LoginPage";
import Aboutpage from "./pages/Public/AboutPage/Aboutpage";
import NotFoundPage from "./pages/Public/NotFoundPage/NotFoundPage";
import SupportPage from "./pages/Public/SupportPage/SupportPage";
import HistoryPage from "./pages/Public/HistoryPage/HistoryPage";
import AccountDetailPage from "./pages/Public/AccountPage/AccountDetailPage";
import NewPostPage from "./pages/Public/NewPostPage/NewPostPage";
import SavedBlogsPage from "./pages/Public/SavedBlogsPage/SavedBlogsPage";
import ProfilePage from "./pages/Public/AccountPage/ProfilePage";
import TagPage from "./pages/Public/TagPage/TagPage";
import TagList from "./pages/Public/TagPage/TagList";
import PopularPage from "./pages/Public/PopularPage/PopularPage";
import ReportItemList from "./components/Report/ReportItemList";
import FeedbackPage from "./pages/Public/FeedbackPage/FeedbackPage";

import {
  CategoriesPage,
  BlogPage,
  CustomerPage,
  SettingPage,
} from "./pages/Admin";

const getUserRole = () => localStorage.getItem("userRole");

const AdminLayout = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const sidebarRef = useRef(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        openSidebarToggle
      ) {
        setOpenSidebarToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebarToggle]);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        ref={sidebarRef}
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<BlogPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="settings" element={<SettingPage />} />
          <Route path="report-items" element={<ReportItemList />} />
        </Routes>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

const AdminRoute = ({ children }) => {
  const userRole = getUserRole();
  return userRole === "ADMIN" ? children : <Navigate to="/" />;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
const GoogleAuthStyle = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://accounts.google.com/gsi/style";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
};
const App = () => {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onScriptLoadSuccess={() => console.log("Google OAuth ready")}
    >
      <GoogleAuthStyle />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/blog/:id" element={<BlogContentPage />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/account" element={<AccountDetailPage />} />
        <Route path="/newpost" element={<NewPostPage />} />
        <Route path="/saved" element={<SavedBlogsPage />} />
        <Route path="/category" element={<TagPage />} />
        <Route path="/category/:categoryName" element={<TagList />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
