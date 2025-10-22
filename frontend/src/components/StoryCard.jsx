import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Video from "./Video";
import { useEffect, useState } from "react";

const StoryCard = () => {
  const navigate = useNavigate();
  const { story } = useSelector((state) => state.storySlice);
  const [progress, setProgress] = useState(0)

  useEffect(()=>{
    const interval = setInterval(()=>{
        setProgress(prev => {
            if(prev >= 100){
                clearInterval(interval)
                navigate("/")
                return 100;
            }
            return prev + 1;
        })
    },150)
    return ()=> clearInterval(interval)
  },[navigate])

  return (
    <div className="relative w-full max-w-[500px] h-screen bg-black text-white flex items-center justify-center border-x border-gray-800">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 w-full flex items-center gap-3 px-4 py-3 bg-black/50 backdrop-blur-md">
        <LuArrowLeft
          onClick={() => navigate("/")}
          className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform"
        />

        {/* Profile Image */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer">
          <img
            src={story?.author?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm md:text-base truncate max-w-[140px]">
            {story?.author?.userName || story?.author?.name || "User"}
          </span>
          <span className="text-xs text-gray-400">Story</span>
        </div>
      </div>

      {/* Story Display Area */}
      <div className="w-full min-h-[100vh] flex items-center justify-center">
        {story?.mediaType == "image" && 
         <div className="w- h-full flex items-center justify-center">
            <img src={story?.media} alt="" />
        </div>}
        {story?.mediaType == "video" && 
         <div className="w-full h-full flex items-center justify-center">
            <Video src={story?.media}/>
        </div>}
      </div>

       <div className="absolute top-[3px] w-full h-[3px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
};

export default StoryCard;
