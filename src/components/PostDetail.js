import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Loader from "./Loader";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();

          // Ensure the createdAt field is a JavaScript Date object
          if (
            postData.createdAt instanceof Object &&
            postData.createdAt.toDate
          ) {
            postData.createdAt = postData.createdAt.toDate(); // Convert Timestamp to Date
          }

          setPost(postData);
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    <Loader />;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  const defaultProfileImage =
    "https://www.example.com/default-profile-image.jpg"; // Replace with your default image URL

  const generateColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`; // Generate HSL color from hash
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-[500px]">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
            style={{
              backgroundColor: post.userProfilePhoto
                ? ""
                : generateColorFromString(post.username || "Guest"),
            }}
          >
            <img
              src={post.userProfilePhoto || defaultProfileImage}
              alt="User Profile"
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <h2 className="font-semibold">{post.username || "Anonymous"}</h2>
            <p className="text-gray-600 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Caption */}
        <h1 className="text-xl font-semibold mb-4">{post.caption}</h1>

        {/* Media Section */}
        <div className="space-y-4">
          {post.mediaUrls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post Media ${index + 1}`}
              className="rounded-lg w-full object-cover"
            />
          ))}
        </div>

        {/* Interaction Section */}
        <div className="mt-6 flex justify-between items-center">
          <button className="flex items-center gap-1 text-pink-600">
            <span>❤️</span>
            <span>67</span>
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
