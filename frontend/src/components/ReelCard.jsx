import React, { useEffect, useRef, useState } from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import dp from "../assets/dp.webp";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { FaRegCommentDots } from "react-icons/fa";

const ReelCard = ({ reel }) => {
  console.log(reel)
  const videoRef = useRef();
  const {user} = useSelector(state => state.userSlice)
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    const video = videoRef.current;
    if (video) observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  return (
    <div className="w-full lg:w-[480px] h-screen flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative">
      <video
        autoPlay
        loop
        muted
        className="w-full h-[100vh] object-cover"
        ref={videoRef}
        src={reel.media}
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
      />

      <div
        onClick={() => setIsMuted((prev) => !prev)}
        className="absolute top-[20px] right-[20px] z-[100] cursor-pointer"
      >
        {!isMuted ? (
          <ImVolumeMute size={25} color="white" /> // muted
        ) : (
          <ImVolumeMute2 size={25} color="white" /> // unmuted
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[5px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-[10px]">
          <div onClick={()=> navigate(`/profile/${reel.author.userName}`)} className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden border border-gray-300">
          <img
            className="w-full h-full object-cover"
            src={reel.author?.profileImage || dp}
            alt=""
          />
        </div>
        <div className="w-[120px] text-white font-semibold truncate">
          {reel.author.userName}
        </div>
        <FollowBtn targetUserId={reel.author._id} tailwind={'px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white'}/>
        </div>
        <div className="text-white px-[10px]">
          {reel.caption}
        </div>
      </div>
      
      <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[180px] justify-center px-[17px]">
        {/* like */}
        <div onClick={handleLike} className="flex flex-col items-center cursor-pointer">
          <div>
            {reel?.likes.includes(user._id) && <FaHeart size={25} color="red"/>}
             {!reel?.likes.includes(user._id) && <FaHeart size={25}/>}
          </div>
          <div>{reel?.likes?.length}</div>
        </div>
        {/* comment */}
        <div className="flex flex-col items-center cursor-pointer">
          <div>
            <FaRegCommentDots size={25} />
          </div>
          <div>{reel.comments?.length}</div>
        </div>

      </div>
    </div>
  );
};

export default ReelCard;
