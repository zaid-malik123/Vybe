import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { LuArrowLeft } from "react-icons/lu";
import { IoIosEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Video from "./Video";
import { useEffect, useState } from "react";

const StoryCard = () => {
  const navigate = useNavigate();
  const { story } = useSelector((state) => state.storySlice);
  const { user } = useSelector((state) => state.userSlice);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative w-full max-w-[500px] h-screen bg-black text-white flex items-center justify-center border-x border-gray-800">
      {/* Progress Bar */}
      <div className="absolute top-[3px] w-full h-[3px] bg-gray-800">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md">
        <LuArrowLeft
          onClick={() => navigate("/")}
          className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform"
        />
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer">
          <img
            src={story?.author?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm md:text-base truncate max-w-[140px]">
            {story?.author?.userName || story?.author?.name || "User"}
          </span>
          <span className="text-xs text-gray-400">Story</span>
        </div>
      </div>

      {/* Story Media */}
      <div className="w-full h-full flex items-center justify-center">
        {story?.mediaType === "image" && (
          <img
            src={story?.media}
            alt=""
            className="max-h-[90vh] object-contain rounded-md"
          />
        )}
        {story?.mediaType === "video" && <Video src={story?.media} />}
      </div>

      {/* View Count (bottom left) */}
      {user?._id === story?.author?._id && (
        <div
          onClick={() => setShowViewers(true)}
          className="absolute bottom-4 left-4 flex items-center gap-2 text-sm cursor-pointer bg-black/50 px-3 py-2 rounded-full backdrop-blur-md hover:bg-black/70 transition-all"
        >
          <IoIosEye size={18} /> {story?.viewers?.length || 0} views
        </div>
      )}

      {/* Viewers Modal */}

      {showViewers && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-[#111] w-full max-w-[400px] rounded-t-2xl p-4 animate-slideUp">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
              <h2 className="text-lg font-semibold">Viewers</h2>
              <button
                onClick={() => setShowViewers(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {story?.viewers?.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {story.viewers.map((viewer) => (
                  <div
                    onClick={()=> navigate(`/profile/${viewer.userName}`)}
                    key={viewer._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-all"
                  >
                    <img
                      src={viewer.profileImage || dp}
                      alt="viewer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {viewer.userName || viewer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {viewer.name || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm">
                No viewers yet 👀
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
