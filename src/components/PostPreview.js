import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { HiArrowSmLeft } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import Loader from "./Loader";
import { toast, ToastContainer } from "react-toastify";

const PostPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { selectedFiles } = location.state || { selectedFiles: [] };

  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const captionRef = useRef(null);

  const uploadFile = async (fileOrUrl) => {
    if (!user) {
      toast.error("User is not authenticated.");
      throw new Error("User is not authenticated.");
    }

    let fileBlob;
    let fileName;

    if (fileOrUrl instanceof File) {
      fileBlob = fileOrUrl;
      fileName =
        fileOrUrl.name || `file-${Date.now()}${fileOrUrl.type.split("/")[1]}`;
    } else if (typeof fileOrUrl === "string") {
      try {
        const response = await fetch(fileOrUrl);
        if (!response.ok) {
          toast.error(`Failed to fetch file: ${fileOrUrl}`);
          throw new Error(`Failed to fetch file: ${fileOrUrl}`);
        }
        fileBlob = await response.blob();

        const urlParts = fileOrUrl.split(/[#?]/)[0].split(".");
        fileName = `file-${Date.now()}.${
          urlParts[urlParts.length - 1] || "jpg"
        }`;
      } catch (error) {
        console.error("Error processing URL:", error);
        toast.error("Error processing file URL");
        throw error;
      }
    } else {
      toast.error("Invalid file type. Expected a File object or URL.");
      throw new Error("Invalid file type. Expected a File object or URL.");
    }

    const fileRef = ref(storage, `posts/${user.uid}/${fileName}`);
    await uploadBytes(fileRef, fileBlob);
    return await getDownloadURL(fileRef);
  };

  const fetchUserDetails = async () => {
    if (!user) return null;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return {
          userId: user.uid,
          username: userDocSnap.data().username,
          userProfilePhoto: userDocSnap.data().photoURL,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details.");
      return null;
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.warn("You must be logged in to create a post.");
      return;
    }

    if (!selectedFiles || !selectedFiles.length) {
      toast.warn("No files selected.");
      return;
    }

    setUploading(true);
    toast.info("Uploading post...");

    try {
      const userDetails = await fetchUserDetails();

      if (!userDetails) {
        toast.error("Could not retrieve user details.");
        throw new Error("Could not retrieve user details");
      }

      const mediaUrls = await Promise.all(
        selectedFiles.map((fileOrUrl) => uploadFile(fileOrUrl))
      );

      await addDoc(collection(db, "posts"), {
        ...userDetails,
        caption,
        mediaUrls,
        createdAt: new Date(),
      });

      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    } finally {
      setUploading(false);
    }
  };

  const handleCaptionChange = (e) => {
    const newCaption = e.target.innerText;
    setCaption(newCaption);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <div>Please log in to create a post.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <ToastContainer />
      <div className="w-full max-w-md p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="text-xl text-black">
          <HiArrowSmLeft />
        </button>
        <h1 className="flex-grow text-lg font-karla font-extrabold text-black">
          New Post
        </h1>
      </div>
      <div className="w-full max-w-md p-6">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full h-80"
        >
          {selectedFiles.map((file, index) => (
            <SwiperSlide key={index}>
              {file instanceof File && file.type?.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <img
                  src={file instanceof File ? URL.createObjectURL(file) : file}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="relative w-[calc(100%-32px)] max-w-md mx-4 mt-4">
        <input
          ref={captionRef}
          className="w-full border-b-2 border-gray-300 focus:outline-none"
          onInput={handleCaptionChange}
          placeholder="Write a caption..."
          style={{ minHeight: "40px" }}
        />
      </div>

      <div className="w-full max-w-md p-4 mb-[80px] mt-auto flex justify-end">
        <button
          onClick={handleCreatePost}
          className="w-full bg-black text-white py-2 rounded-full font-karla font-bold text-base disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default PostPreview;
