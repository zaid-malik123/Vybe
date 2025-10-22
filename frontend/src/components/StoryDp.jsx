import { FaPlus } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StoryDp = ({ profileImage, userName, story }) => {
  const navigate = useNavigate()
  const {user} = useSelector(state => state.userSlice)
  
  const handleClick = ()=>{
    if(!story && userName == "Your Story"){
      navigate("/upload")
    }
    else if (story && userName == "Your Story"){
      navigate(`/story/${user.userName}`)
    }
    else {
      navigate(`/story/${userName}`)
    }
  }

  return (
    <div className="flex flex-col w-[80px] items-center">
      <div
        onClick={handleClick} 
        className={`w-[80px] h-[80px] ${
          story ? "bg-gradient-to-tr from-blue-400 to-blue-950" : ""
        } rounded-full flex justify-center items-center relative`}
      >
        {/* Inner black circle */}
        <div className="w-[72px] h-[72px] bg-black rounded-full overflow-hidden border-2 border-black">
          <img
            className="w-full h-full object-cover"
            src={profileImage || dp}
            alt={userName}
          />
        </div>


        {!story && userName === "Your Story" && (
          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-[4px] border-2 border-black">
            <FaPlus size={12} color="white" />
          </div>
        )}
      </div>

      {/* Username */}
      <div className="text-[14px] text-center truncate w-full text-white mt-1">
        {userName}
      </div>
    </div>
  );
};

export default StoryDp;
