import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCash, HiCamera } from "react-icons/hi";
import { IoMdArrowRoundBack } from "react-icons/io";

import post1 from "../assets/post1.jpeg";
import post2 from "../assets/post2.jpeg";
import post3 from "../assets/post3.jpeg";
import post4 from "../assets/post4.jpeg";
import post5 from "../assets/post5.jpeg";
import post6 from "../assets/post6.jpeg";

const ImageSelection = () => {
  const defaultImages = [post1, post2, post3, post4, post5, post6];

  const [selectedItems, setSelectedItems] = useState([]);
  const [previewFile, setPreviewFile] = useState(defaultImages[0]);
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedItems((prev) => [...prev, ...files]);
      setPreviewFile(files[0]);
    }
  };

  const handleCameraCapture = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedItems((prev) => [...prev, ...files]);
      setPreviewFile(files[0]);
    }
  };

  const setAsPreview = (file) => {
    setPreviewFile(file);
  };

  const handleItemClick = (item) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        return [...prev, item];
      }
    });
    setAsPreview(item);
  };

  const handleNext = () => {
    if (selectedItems.length > 0) {
      navigate("/post-preview", { state: { selectedFiles: selectedItems } });
    } else {
      alert("Please select at least one image or video.");
    }
  };

  const getObjectURL = (file) => {
    if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return file;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="relative w-full max-w-[500px] mx-auto h-72 md:h-96 bg-white">
        {previewFile ? (
          typeof previewFile === "string" ? (
            <img
              src={previewFile}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : previewFile.type?.startsWith("video/") ? (
            <video
              src={getObjectURL(previewFile)}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={getObjectURL(previewFile)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <img
            src="https://via.placeholder.com/800x600"
            alt="Background"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-2xl font-bold"
          >
            <IoMdArrowRoundBack />
          </button>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-black bg-opacity-70 text-white rounded-full text-sm md:text-base"
          >
            Next
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 w-full max-w-[500px] mx-auto bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-2xl font-bold">Gallery</h2>
          <div className="flex gap-4">
            <label className="relative flex items-center justify-center w-10 h-10 bg-black text-white rounded-full cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                multiple={multiSelectEnabled}
                onChange={handleFileChange}
                className="hidden"
                onClick={() => setMultiSelectEnabled(true)}
              />
              <HiCash className="text-xl" />
            </label>
            <label
              className={`relative flex items-center justify-center w-10 h-10 bg-black text-white rounded-full cursor-pointer ${
                multiSelectEnabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                disabled={multiSelectEnabled}
                className="hidden"
              />
              <HiCamera className="text-xl" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {[
            ...defaultImages,
            ...selectedItems.filter((item) => item instanceof File),
          ].map((item, index) => (
            <div
              key={index}
              className="relative w-full h-24 md:h-32 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {item instanceof File && item.type?.startsWith("video/") ? (
                <video
                  src={getObjectURL(item)}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <img
                  src={item instanceof File ? getObjectURL(item) : item}
                  alt={`Selected ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              {selectedItems.includes(item) && (
                <div className="absolute top-1 right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedItems.indexOf(item) + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSelection;
