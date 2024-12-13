import React, { useState } from "react";
import { storage, db } from "../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

const NewPost = () => {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages([...e.target.files]);
    }
  };

  const handlePost = async () => {
    if (!caption && images.length === 0) {
      alert("Add a caption or select media to post!");
      return;
    }
    setUploading(true);

    const uploadPromises = images.map((image) => {
      const storageRef = ref(storage, `posts/${Date.now()}-${image.name}`);
      return uploadBytesResumable(storageRef, image).then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );
    });

    try {
      const mediaUrls = await Promise.all(uploadPromises);

      await addDoc(collection(db, "posts"), {
        caption,
        media: mediaUrls,
        timestamp: new Date(),
      });

      alert("Post created successfully!");
      setImages([]);
      setCaption("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Create a Post</h1>
      <textarea
        placeholder="Write a caption..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handlePost}
        disabled={uploading}
        className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Post"}
      </button>
      {images.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Selected Media:</h2>
          <ul className="list-disc ml-4">
            {Array.from(images).map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewPost;
