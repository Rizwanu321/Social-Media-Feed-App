import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import defaultProfileImage from "../assets/profile.jpeg";
import defaultBackgroundImage from "../assets/profile.jpeg";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { HiHeart } from "react-icons/hi";
import { HiArrowSmLeft } from "react-icons/hi";
import Loader from "./Loader";

function UserProfile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const userPostsQuery = query(
          postsRef,
          where("userId", "==", user?.uid)
        );
        const querySnapshot = await getDocs(userPostsQuery);
        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchUserPosts();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-10">
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) {
    <Loader />;
  }

  const handleNewPost = () => {
    navigate("/image-selection");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="w-full h-screen bg-white overflow-auto max-w-[500px] mx-auto">
      <div
        className="relative w-full h-40 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            user.backgroundURL || defaultBackgroundImage
          })`,
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-2xl mt-3 ml-4 text-white"
        >
          <HiArrowSmLeft size={26} />
        </button>
        <div className="absolute -bottom-10 left-4">
          <img
            src={user.photoURL || defaultProfileImage}
            alt="Profile"
            className="w-[100px] h-[100px] ml-5 rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="flex justify-end">
          <button
            className="px-16 py-2 mr-4 border-solid border-2 border-black-600 text-gray-800 rounded-full font-semibold"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>

        <h1 className="text-2xl font-bold">{user.username || "Guest"}</h1>

        <p className="text-gray-600 mt-2">
          {user.bio || "Welcome to your profile! 🌟"}
        </p>
      </div>

      <div className="px-4 mt-6 mb-3">
        <h2 className="text-lg font-semibold mb-4">My Posts</h2>

        {posts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {posts.map((post) => {
              const isFirstMediaVideo =
                post.mediaUrls?.[0]?.includes(".mp4") ||
                post.mediaUrls?.[0]?.includes(".webm") ||
                post.mediaUrls?.[0]?.includes(".mov");
              const randomLikes =
                Math.floor(Math.random() * (500 - 10 + 1)) + 10;
              return (
                <div key={post.id} className="relative group cursor-pointer">
                  {isFirstMediaVideo ? (
                    <video
                      src={post.mediaUrls?.[0]}
                      className="rounded-lg w-full h-48 object-cover"
                      playsInline
                      muted
                    />
                  ) : (
                    <img
                      src={post.mediaUrls?.[0] || defaultProfileImage}
                      alt={post.caption || "Post"}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  )}

                  {post.mediaUrls?.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      1/{post.mediaUrls.length}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex flex-col justify-end p-3 text-white">
                    <p className="font-semibold truncate">{post.caption}</p>
                    <div className="flex items-center space-x-1 text-sm">
                      <HiHeart size={20} />
                      <span>{randomLikes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No posts to show yet. Start sharing your moments!
          </p>
        )}
      </div>

      <div className="w-full max-w-[500px]">
        <button
          className="fixed bottom-6 right-6 md:bottom-10 md:right-[calc((100vw-460px)/2-10px)] bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          aria-label="Create Post"
          onClick={handleNewPost}
        >
          <FaPlus size={20} color="#ffffff" />
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
