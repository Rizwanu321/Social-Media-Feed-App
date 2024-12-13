import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { HiHeart } from "react-icons/hi";
import { BiSolidNavigation } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";

const defaultProfileImage = "/default-profile-image.jpg";

const isVideoFile = (url) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  return (
    videoExtensions.some((ext) => url.toLowerCase().includes(ext)) ||
    url.includes("youtube.com") ||
    url.includes("vimeo.com")
  );
};

const renderMedia = (post, currentSlideIndex, setCurrentSlideIndex) => {
  const mediaUrls = post.mediaUrls || [];

  if (mediaUrls.length === 1) {
    return isVideoFile(mediaUrls[0]) ? (
      <video
        key={mediaUrls[0]}
        src={mediaUrls[0]}
        controls
        className="rounded-lg w-full h-[300px] object-cover"
        onError={(e) => console.error("Video load error:", e)}
      />
    ) : (
      <img
        src={mediaUrls[0]}
        alt="Post Media"
        className="rounded-lg w-full h-[300px] object-cover"
      />
    );
  }

  if (mediaUrls.length === 2) {
    return (
      <div className="flex gap-2">
        {mediaUrls.map((url, index) => (
          <div key={index} className={`${index === 0 ? "w-[60%]" : "w-[40%]"}`}>
            {isVideoFile(url) ? (
              <video
                src={url}
                controls
                className="w-full h-[300px] object-cover rounded-lg"
                onError={(e) =>
                  console.error(`Video load error for ${url}:`, e)
                }
              />
            ) : (
              <img
                src={url}
                alt={`Post Media ${index + 1}`}
                className="w-full h-[300px] object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (mediaUrls.length > 2) {
    return (
      <div className="relative">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          className="w-full"
          onSlideChange={(swiper) => {
            setCurrentSlideIndex((prev) => ({
              ...prev,
              [post.id]: swiper.realIndex,
            }));
          }}
        >
          {mediaUrls.map((url, mediaIndex) => (
            <SwiperSlide key={mediaIndex}>
              {isVideoFile(url) ? (
                <video
                  key={url}
                  src={url}
                  controls
                  className="w-full h-[300px] object-cover rounded-lg"
                  onError={(e) =>
                    console.error(`Video load error for ${url}:`, e)
                  }
                />
              ) : (
                <img
                  src={url}
                  alt={`Post Media ${mediaIndex + 1}`}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        {mediaUrls.length > 1 && (
          <div className="absolute top-2 right-2 z-10 bg-white text-black px-2 py-1 rounded-lg">
            {`${(currentSlideIndex[post.id] || 0) + 1}/${mediaUrls.length}`}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const FeedPost = ({ post, onShareClick }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const randomLikes = Math.floor(Math.random() * (500 - 10 + 1)) + 10;

  return (
    <div
      key={post.id}
      className="rounded-lg shadow p-4 mb-4"
      style={{ backgroundColor: post.backgroundColor }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full">
          <img
            src={post.userProfilePhoto || defaultProfileImage}
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{post.username}</h3>
          <p className="text-gray-600 text-sm">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-gray-800 mb-3">{post.caption}</p>

      <div className="mb-3">
        {renderMedia(post, currentSlideIndex, setCurrentSlideIndex)}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-pink-600">
            <HiHeart size={20} />
            <span>{randomLikes}</span>
          </button>
        </div>
        <button
          className="bg-white text-black px-3 py-1 rounded-lg shadow flex items-center gap-1"
          onClick={() => onShareClick(post.id)}
        >
          <BiSolidNavigation size={20} />
          Share
        </button>
      </div>
    </div>
  );
};

export default FeedPost;
