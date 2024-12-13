import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import defaultProfileImage from "../assets/profile.jpeg";
import defaultBackgroundImage from "../assets/img2.jpeg";
import { HiArrowSmLeft } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.username || "");
  const [bio, setBio] = useState(
    user?.bio ||
      "Just someone who loves designing, sketching, and finding beauty in the little things 💕"
  );
  const [photoURL, setPhotoURL] = useState(
    user?.photoURL || defaultBackgroundImage
  );
  const [backgroundURL, setBackgroundURL] = useState(
    user?.backgroundURL || defaultProfileImage
  );
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        if (type === "profile") {
          setPhotoURL(base64Image);
        } else if (type === "background") {
          setBackgroundURL(base64Image);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        username: name.trim(),
        bio: bio.trim(),
        photoURL: photoURL.trim(),
        backgroundURL: backgroundURL.trim(),
      };

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updatedData);

      updateUser(updatedData);

      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex justify-center min-h-screen">
        <div className="relative w-full max-w-[500px] bg-white shadow-lg rounded-lg overflow-auto">
          <div
            className="relative w-full h-40 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundURL})`,
            }}
          >
            <div className="absolute top-4 left-4 flex items-center space-x-2 text-white">
              <button
                onClick={() => navigate(-1)}
                className="text-2xl text-white"
              >
                <HiArrowSmLeft size={26} />
              </button>
              <h1 className="text-xl font-semibold">Edit Profile</h1>
            </div>

            <label
              htmlFor="background-upload"
              className="absolute top-32 right-2 bg-[#F4F4F4] p-2 rounded-full text-black cursor-pointer"
            >
              <FiEdit2 size={18} />
            </label>
            <input
              type="file"
              id="background-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, "background")}
            />

            <div className="absolute -bottom-10 left-4">
              <div className="relative">
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-2 right-0 bg-[#F4F4F4] p-1 rounded-full text-black cursor-pointer"
                >
                  <FiEdit2 size={14} />
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, "profile")}
                />
              </div>
            </div>
          </div>

          <div className="mt-16 px-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border-b focus:ring-2 focus:ring-pink-400 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-4 px-4 ">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows="2"
              className="w-full p-2 border-b focus:ring-2 focus:ring-pink-400 focus:outline-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          <div className="w-full max-w-md p-4 mt-40 mt-auto flex justify-end">
            <button
              className="w-full bg-black text-white py-2 rounded-full font-karla font-bold text-base disabled:opacity-50"
              disabled={loading}
              onClick={handleSave}
            >
              {loading ? "Saving..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditProfile;
