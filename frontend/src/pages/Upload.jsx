import { ClipLoader } from "react-spinners";
import axios from "axios";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/slice/postSlice";
import { setStory } from "../redux/slice/storySlice";
import { setReels } from "../redux/slice/reelSlice";
import Video from "../components/Video";
import { setUser } from "../redux/slice/userSlice";

const Upload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts } = useSelector((state) => state.postSlice);
  const { reels } = useSelector((state) => state.reelSlice);
  const { story } = useSelector((state) => state.storySlice);

  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState();
  const [caption, setCaption] = useState("");

  const mediaInput = useRef();

  // 🖼 Handle selected file
  const handleMedia = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type.includes("image")) {
        setMediaType("image");
      } else {
        setMediaType("video");
      }
      setBackendMedia(file);
      setFrontendMedia(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  // 📤 Upload Post
  const uploadPost = async () => {
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);
      formData.append("caption", caption);

      const res = await axios.post(`${serverUrl}/api/post/upload-post`, formData, {
        withCredentials: true,
      });

      dispatch(setPosts([...posts, res.data]));
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // 📤 Upload Story
  const uploadStory = async () => {
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const res = await axios.post(`${serverUrl}/api/story/upload-story`, formData, {
        withCredentials: true,
      });

      setUser(prev => ({ ...prev, story: res.data }))
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // 📤 Upload Reel
  const uploadReel = async () => {
    try {
      const formData = new FormData();
      formData.append("media", backendMedia);
      formData.append("caption", caption);

      const res = await axios.post(`${serverUrl}/api/reel/upload-reel`, formData, {
        withCredentials: true,
      });

      // ✅ Fixed here → was using `reel` instead of `reels`
      dispatch(setReels([...reels, res.data]));
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // 🚀 Handle Upload Type
  const handleUpload = () => {
    if (!backendMedia) return alert("Please select media first.");
    setLoading(true);

    if (uploadType === "post") uploadPost();
    else if (uploadType === "reel") uploadReel();
    else uploadStory();
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center">
      {/* 🔹 Top Bar */}
      <div className="w-full max-w-[600px] flex items-center justify-between py-6 border-b border-gray-800 px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-all"
        >
          <LuArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-lg font-semibold text-white text-center flex-1">
          Upload Media
        </h2>
        <div className="w-[60px]" />
      </div>

      {/* 🔹 Upload Type Tabs */}
      <div className="w-[90%] max-w-[600px] h-[70px] bg-white/10 rounded-full flex justify-around items-center gap-[10px] mt-[25px] backdrop-blur-sm border border-gray-800">
        {["post", "story", "reel"].map((type) => (
          <div
            key={type}
            onClick={() => setUploadType(type)}
            className={`${
              uploadType === type
                ? "bg-white text-black font-semibold"
                : "text-white"
            } w-[28%] h-[80%] flex justify-center items-center text-[17px] rounded-full cursor-pointer transition-all hover:bg-white hover:text-black`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      <input
        onChange={handleMedia}
        ref={mediaInput}
        type="file"
        hidden
        accept="image/*,video/*"
      />

      {/* 🔹 Upload Box */}
      {!frontendMedia && (
        <div
          onClick={() => mediaInput.current.click()}
          className="w-[85%] max-w-[500px] h-[260px] bg-[#14171a] border border-gray-700 flex flex-col items-center justify-center gap-[10px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#1e2327] transition-all"
        >
          <FaPlus size={30} color="white" />
          <div className="text-[18px] text-white font-semibold capitalize">
            Upload {uploadType}
          </div>
          <p className="text-gray-400 text-sm">Tap to choose media</p>
        </div>
      )}

      {/* 🔹 Media Preview */}
      {frontendMedia && (
        <div className="w-[85%] max-w-[500px] mt-[8vh] flex flex-col items-center gap-4">
          {mediaType === "image" ? (
            <img
              src={frontendMedia}
              alt="preview"
              className="w-full max-h-[300px] object-contain rounded-2xl shadow-lg"
            />
          ) : (
            <Video src={frontendMedia} />
          )}

          {uploadType !== "story" && (
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full min-h-[100px] bg-[#0d0f10] text-white text-[16px] rounded-xl p-3 border border-gray-700 outline-none resize-none focus:border-gray-400 transition-all"
            ></textarea>
          )}

          <button
            onClick={handleUpload}
            className="w-full py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all mb-[20px]"
          >
            {loading ? (
              <ClipLoader size={30} color="black" />
            ) : (
              `Upload ${uploadType}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
