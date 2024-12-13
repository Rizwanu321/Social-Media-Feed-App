import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { FaPlus } from "react-icons/fa6";

import Loader from "./Loader";
import ShareModal from "./ShareModal";
import NavMenu from "./NavMenu";
import FeedPost from "./FeedPost";

const PASTEL_BACKGROUNDS = [
  "#FFFAEE",
  "#F7EBFF",
  "#E6F3FF",
  "#F0FFF4",
  "#FFF5E6",
  "#F0F4F8",
  "#FFF0F5",
  "#E6FFFA",
];

const POSTS_PER_PAGE = 20;

const SocialMediaFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentShareLink, setCurrentShareLink] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const lastDocumentRef = useRef(null);
  const defaultProfileImage = "/default-profile-image.jpg";

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return {
          username: userDocSnap.data().username,
          userProfilePhoto: userDocSnap.data().photoURL || defaultProfileImage,
        };
      }
      return {
        username: "Unknown User",
        userProfilePhoto: defaultProfileImage,
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return {
        username: "Unknown User",
        userProfilePhoto: defaultProfileImage,
      };
    }
  };

  const fetchPosts = useCallback(
    async (isInitialFetch = false) => {
      if (!hasMore && !isInitialFetch) return;

      try {
        setLoading(true);
        const postsCollection = collection(db, "posts");

        let postsQuery;
        if (isInitialFetch) {
          postsQuery = query(
            postsCollection,
            orderBy("createdAt", "desc"),
            limit(POSTS_PER_PAGE)
          );
        } else {
          if (!lastDocumentRef.current) return;
          postsQuery = query(
            postsCollection,
            orderBy("createdAt", "desc"),
            startAfter(lastDocumentRef.current),
            limit(POSTS_PER_PAGE)
          );
        }

        const postsSnapshot = await getDocs(postsQuery);

        if (postsSnapshot.docs.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }

        if (postsSnapshot.docs.length > 0) {
          lastDocumentRef.current =
            postsSnapshot.docs[postsSnapshot.docs.length - 1];
        }

        const postsWithDetails = await Promise.all(
          postsSnapshot.docs.map(async (postDoc, index) => {
            const postData = postDoc.data();
            postData.id = postDoc.id;

            postData.backgroundColor =
              PASTEL_BACKGROUNDS[
                (posts.length + index) % PASTEL_BACKGROUNDS.length
              ];

            if (postData.createdAt) {
              postData.createdAt = postData.createdAt.toDate
                ? postData.createdAt.toDate()
                : new Date(postData.createdAt);
            }

            const userDetails = await fetchUserDetails(postData.userId);

            return {
              ...postData,
              username: userDetails.username,
              userProfilePhoto: userDetails.userProfilePhoto,
            };
          })
        );

        setPosts((prevPosts) =>
          isInitialFetch
            ? postsWithDetails
            : [...prevPosts, ...postsWithDetails]
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [hasMore, posts.length]
  );

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight &&
      !loading &&
      hasMore
    ) {
      fetchPosts();
    }
  }, [loading, hasMore, fetchPosts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNewPost = () => {
    navigate("/image-selection");
  };

  const handleShareClick = (postId) => {
    setCurrentShareLink(`${window.location.origin}/post/${postId}`);
    setIsShareModalOpen(true);
  };

  const handleCloseModal = () => setIsShareModalOpen(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  if (loading && posts.length === 0) {
    return <Loader />;
  }

  return (
    <div className="bg-white min-h-screen shadow-lg rounded-lg p-4 flex flex-col items-center justify-center">
      <div className="bg-white p-4 mb-4 w-full max-w-[500px]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold">
            <img
              src={user?.photoURL || defaultProfileImage}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-400">Welcome Back,</p>
            <h1 className="text-lg font-semibold">
              {user?.username || "Guest"}
            </h1>
          </div>
        </div>

        <NavMenu
          isNavOpen={isNavOpen}
          toggleNav={toggleNav}
          user={user}
          defaultProfileImage={defaultProfileImage}
        />
      </div>

      <div className="w-full max-w-[500px]">
        <h1 className="text-2xl font-extrabold mb-4">Feeds</h1>
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} onShareClick={handleShareClick} />
        ))}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseModal}
        pageLink={currentShareLink}
      />

      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more posts to load
        </div>
      )}

      <div className="w-full max-w-[500px]">
        <button
          className="fixed bottom-6 right-6 md:bottom-10 md:right-[calc((100vw-480px)/2-10px)] bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          aria-label="Create Post"
          onClick={handleNewPost}
        >
          <FaPlus size={20} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

export default SocialMediaFeed;
