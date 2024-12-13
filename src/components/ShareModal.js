import React from "react";
import {
  FaTwitter,
  FaFacebook,
  FaReddit,
  FaDiscord,
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaFacebookMessenger,
  FaCopy,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShareModal = ({ isOpen, onClose, pageLink }) => {
  if (!isOpen) return null;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      pageLink
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      pageLink
    )}`,
    reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(pageLink)}`,
    discord: pageLink,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(pageLink)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(pageLink)}`,
    instagram: pageLink,
    messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      pageLink
    )}&app_id=YOUR_APP_ID`,
  };

  const iconStyles = {
    background: "#E7F1FD",
    borderRadius: "50%",
    padding: "10px",
  };

  const specialBackground = {
    background: "#FF40C617",
    borderRadius: "50%",
    padding: "10px",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pageLink);
    toast.success("Link copied to clipboard!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96 mx-4 sm:mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Share post</h2>
            <button onClick={onClose} className="text-gray-500 text-2xl">
              &times;
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={iconStyles}>
                <FaTwitter className="text-blue-400 text-2xl" />
              </div>
              <span className="text-sm mt-2">Twitter</span>
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={iconStyles}>
                <FaFacebook className="text-blue-600 text-2xl" />
              </div>
              <span className="text-sm mt-2">Facebook</span>
            </a>
            <a
              href={shareLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={specialBackground}>
                <FaReddit className="text-orange-500 text-2xl" />
              </div>
              <span className="text-sm mt-2">Reddit</span>
            </a>
            <a
              href={shareLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={iconStyles}>
                <FaDiscord className="text-indigo-600 text-2xl" />
              </div>
              <span className="text-sm mt-2">Discord</span>
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={iconStyles}>
                <FaWhatsapp className="text-green-500 text-2xl" />
              </div>
              <span className="text-sm mt-2">WhatsApp</span>
            </a>
            <a
              href={shareLinks.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={iconStyles}>
                <FaFacebookMessenger className="text-blue-500 text-2xl" />
              </div>
              <span className="text-sm mt-2">Messenger</span>
            </a>
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={iconStyles}>
                <FaTelegram className="text-blue-400 text-2xl" />
              </div>
              <span className="text-sm mt-2">Telegram</span>
            </a>
            <a
              href={shareLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80"
            >
              <div style={specialBackground}>
                <FaInstagram className="text-pink-500 text-2xl" />
              </div>
              <span className="text-sm mt-2">Instagram</span>
            </a>
          </div>
          <h2 className="mb-2 font-semibold">Page Link</h2>
          <div className="flex items-center bg-gray-100 rounded-md p-3">
            <input
              type="text"
              value={pageLink}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm text-gray-700"
            />
            <button
              className="text-blue-500 text-sm font-semibold"
              onClick={handleCopy}
            >
              <FaCopy className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ShareModal;
