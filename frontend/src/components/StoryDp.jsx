import { FaPlus } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect, useState } from "react";

const StoryDp = ({ profileImage, userName, story }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const { storyList } = useSelector((state) => state.storySlice);
  const [viewed, setViewed] = useState(false);

  const handleViewers = async () => {
    const storyId = typeof story === "string" ? story : story?._id;

    if (!storyId) {
      console.log("⚠️ No valid storyId:", story);
      return;
    }

    try {
      await axios.get(`${serverUrl}/api/story/view-story/${storyId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log("❌ Axios error:", error);
    }
  };

  useEffect(() => {
    if (story?.viewers?.some((view) => user._id === view._id)) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [story, user, storyList]);

  const handleClick = () => {
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else if (story && userName === "Your Story") {
      handleViewers();
      navigate(`/story/${user.userName}`);
    } else if (story) {
      handleViewers();
      navigate(`/story/${userName}`);
    } else {
      navigate(`/story/${userName}`);
    }
  };

  // Determine border class based on story/viewed
  let borderClass = "border-2 border-gray-700"; // Default for no story
  if (story) {
    borderClass = viewed
      ? "border-2 border-gray-600" // Viewed
      : "bg-gradient-to-tr from-blue-400 to-blue-950 border-2 border-transparent"; // Unviewed
  }

  return (
    <div className="flex flex-col w-[80px] items-center">
      <div
        onClick={handleClick}
        className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative cursor-pointer`}
      >
        {/* Outer border */}
        <div
          className={`w-[80px] h-[80px] rounded-full flex justify-center items-center ${borderClass} p-[2px]`}
        >
          {/* Inner black circle */}
          <div className="w-[72px] h-[72px] bg-black rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={profileImage || dp}
              alt={userName}
            />
          </div>

          {/* Plus icon if no story */}
          {!story && userName === "Your Story" && (
            <div className="absolute bottom-[4px] right-0 bg-blue-500 rounded-full p-[4px] border-2 border-black">
              <FaPlus size={12} color="white" />
            </div>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="text-[14px] text-center truncate w-full text-white mt-1">
        {userName}
      </div>
    </div>
  );
};

export default StoryDp;
