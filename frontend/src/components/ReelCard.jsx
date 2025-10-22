import React, { useEffect, useRef, useState } from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import dp from "../assets/dp.webp";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCommentDots } from "react-icons/fa";
import { setReels } from "../redux/slice/reelSlice";
import { serverUrl } from "../App";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

const ReelCard = ({ reel }) => {
  const videoRef = useRef();
  const commentRef = useRef();
  const { user } = useSelector((state) => state.userSlice);
  const { reels } = useSelector((state) => state.reelSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };
    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

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

  const handleLike = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/reel/like-reel/${reel._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      const updatedLoop = res.data;
      const updatedLoops = reels.map((p) =>
        p._id.toString() === reel._id.toString() ? updatedLoop : p
      );
      dispatch(setReels(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/reel/comment-reel/${reel._id}`,
        { comment },
        {
          withCredentials: true,
        }
      );
      const updatedLoop = res.data;
      const updatedLoops = reels.map((p) =>
        p._id.toString() === reel._id.toString() ? updatedLoop : p
      );
      dispatch(setReels(updatedLoops));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 5000);
    {
      !reel.likes.includes(user._id) && handleLike();
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
    <div className="w-full lg:w-[480px] h-screen flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50">
          <FaHeart color="white" size={100} />
        </div>
      )}
      <video
        onDoubleClick={handleLikeOnDoubleClick}
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
          <div
            onClick={() => navigate(`/profile/${reel.author.userName}`)}
            className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden border border-gray-300"
          >
            <img
              className="w-full h-full object-cover"
              src={reel.author?.profileImage || dp}
              alt=""
            />
          </div>
          <div className="w-[120px] text-white font-semibold truncate">
            {reel.author.userName}
          </div>
          <FollowBtn
            targetUserId={reel.author._id}
            tailwind={
              "px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"
            }
          />
        </div>
        <div className="text-white px-[10px]">{reel.caption}</div>
      </div>

      <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[180px] justify-center px-[17px]">
        {/* like */}
        <div
          onClick={handleLike}
          className="flex flex-col items-center cursor-pointer"
        >
          <div>
            {reel?.likes.includes(user._id) && (
              <FaHeart size={25} color="red" />
            )}
            {!reel?.likes.includes(user._id) && <FaRegHeart size={25} />}
          </div>
          <div>{reel?.likes?.length}</div>
        </div>
        {/* comment */}
        <div
          onClick={() => setShowComment(true)}
          className="flex flex-col items-center cursor-pointer"
        >
          <div>
            <FaRegCommentDots size={25} />
          </div>
          <div>{reel.comments?.length}</div>
        </div>
      </div>

      {/* Comment */}
      <div
        ref={commentRef}
        className={`absolute z-[100] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${
          showComment ? "translate-y-0" : "translate-y-[100%]"
        }`}
      >
        <h1 className="text-white text-[20px] text-center font-semibold mb-3">
          Comments
        </h1>

        {reel.comments.length === 0 && (
          <div className="text-center text-white font-semibold text-[20px] mt-[50px]">
            {" "}
            No comments Yet
          </div>
        )}

        <div className="flex flex-col justify-between h-[90%]">
          {/* Comments list area */}
          <div className="overflow-y-auto p-2 space-y-4">
            {/* Example comment */}
            {reel.comments.map((comm, idx) => (
              <div className="flex items-start space-x-3">
                <img
                  src={comm.author.profileImage || dp}
                  alt="user"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-white text-sm break-words whitespace-pre-wrap max-w-[250px] sm:max-w-[350px] md:max-w-[400px]">
                    <span className="font-semibold mr-1 break-keep">
                      {comm.author.userName}
                    </span>
                    {comm.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input box */}
          <div className="flex items-center bg-[#1a2526] rounded-full px-3 py-2 mt-3">
            <img
              src={user.profileImage || dp}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <input
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-400 outline-none"
            />
            {comment && (
              <button
                onClick={handleComment}
                className="text-[#0095f6] font-semibold text-sm hover:opacity-80 transition"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
