import React from "react";
import dp from "../assets/dp.webp";

const StoryDp = ({ profileImage, userName }) => {
  return (
    <div className="flex flex-col w-[80px]">
      <div className="w-[80px] h-[80px] bg-gradient-to-tr from-blue-400 to-blue-950 rounded-full flex justify-center items-center">
        <div className="w-[72px] h-[72px] bg-black rounded-full overflow-hidden border-2 border-black">
          <img
            className="w-full h-full object-cover"
            src={profileImage || dp}
            alt={userName}
          />
        </div>     
      </div>
      <div className="text-[14px] text-center truncate w-full text-white">
         {userName}
        </div>
    </div>
  );
};

export default StoryDp;
