import React from "react";
import { useNavigate } from "react-router-dom";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const NavMenu = ({ isNavOpen, toggleNav, user, defaultProfileImage }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      toggleNav();
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 mt-4 z-20 lg:w-[520px]">
        <button onClick={toggleNav} className="text-3xl">
          {isNavOpen ? <HiX /> : <HiMenuAlt1 />}
        </button>
      </div>

      {isNavOpen && (
        <div className="fixed top-0 sm:right-0 md:right-[500px] w-full lg:w-[380px] h-full bg-white shadow-lg z-50 transition-all ease-in-out duration-300">
          <div className="p-4 flex flex-col items-center">
            <button onClick={toggleNav} className="self-end text-3xl mr-5 mb-4">
              <HiX />
            </button>
            <img
              src={user?.photoURL || defaultProfileImage}
              alt="User Profile"
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h2 className="font-semibold">{user?.username || "Guest"}</h2>
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => {
                  navigate("/");
                  toggleNav();
                }}
                className="p-2 text-lg text-gray-600 mb-2"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/profile");
                  toggleNav();
                }}
                className="p-2 text-lg text-gray-600 mb-2"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-lg text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavMenu;
