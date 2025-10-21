import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import Video from "./Video";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdComment } from "react-icons/md";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setPosts } from "../redux/slice/postSlice";
import { setUser } from "../redux/slice/userSlice";
import FollowBtn from "./FollowBtn";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { posts } = useSelector((state) => state.postSlice);

  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  // ✅ Safe check for liked
  const isLiked = post?.likes?.some(
    (like) => like?._id?.toString() === user?._id.toString() || like?.toString() === user?._id.toString()
  );

  // ✅ Safe check for saved
  const isSaved = user?.saved?.some(
    (saved) => saved?._id?.toString() === post?._id.toString() || saved?.toString() === post?._id.toString()
  );

  const handleLike = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/post/like-post/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = res.data;
      const updatedPosts = posts.map((p) =>
        p._id.toString() === post._id.toString() ? updatedPost : p
      );
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaved = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/post/save-post/${post._id}`, {
        withCredentials: true,
      });
      dispatch(setUser(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment-post/${post._id}`,
        { comment },
        { withCredentials: true }
      );
      const updatedPost = res.data;
      const updatedPosts = posts.map((p) =>
        p._id.toString() === post._id.toString() ? updatedPost : p
      );
      dispatch(setPosts(updatedPosts));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[90%] max-w-[600px] flex flex-col gap-3 bg-white items-center rounded-2xl shadow-xl shadow-[#00000025] overflow-hidden transition-all duration-300 hover:shadow-[#00000045]">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-[45px] h-[45px] md:w-[55px] md:h-[55px] rounded-full overflow-hidden border border-gray-300">
            <img
              className="w-full h-full object-cover"
              src={post.author?.profileImage || dp}
              alt=""
            />
          </div>
          <div>
            <h1 className="font-semibold text-[15px] md:text-[16px] text-gray-800 truncate">
              {post.author?.userName || "User"}
            </h1>
            <p className="text-[12px] text-gray-500">
              @{post.author?.userName || post.author?.name || "user"}
            </p>
          </div>
        </div>
        {post.author?._id !== user?._id && (
          <FollowBtn
            targetUserId={post.author?._id}
            tailwind="px-4 py-1.5 bg-black text-white rounded-full text-[13px] md:text-[14px] hover:bg-gray-800 transition-all"
          />
        )}
      </div>

      {/* Media */}
      <div className="w-full bg-[#f9f9f9] flex items-center justify-center">
        {post.mediaType === "image" ? (
          <img className="w-full object-cover max-h-[500px] md:rounded-none" src={post.media} alt="" />
        ) : (
          <Video src={post.media} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-between items-center px-5 py-2">
        <div className="flex items-center gap-5">
          {/* Like */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
            {isLiked ? (
              <GoHeartFill onClick={handleLike} size={25} color="red" />
            ) : (
              <GoHeart onClick={handleLike} size={25} />
            )}
            <span className="text-sm">{post.likes?.length || 0}</span>
          </div>

          {/* Comment */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-70"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <MdComment size={25} />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </div>
        </div>

        {/* Save */}
        <div onClick={handleSaved} className="cursor-pointer hover:opacity-70">
          {isSaved ? <FaBookmark size={25} /> : <FaRegBookmark size={25} />}
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="w-full px-5 pb-3">
          <p className="text-[14px]">
            <span className="font-semibold mr-2">{post.author?.userName}</span>
            {post.caption}
          </p>
        </div>
      )}

      {/* Comments Section */}
      {showComment && (
        <div className="w-full flex flex-col gap-4 px-5 pb-4 border-t border-gray-200 pt-4 bg-[#fafafa] transition-all duration-300">
          <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1">
            {post.comments?.length > 0 ? (
              post.comments.map((cmt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <img
                    src={cmt.author?.profileImage || dp}
                    alt=""
                    className="w-[35px] h-[35px] rounded-full object-cover border border-gray-200"
                  />
                  <div className="bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-2xl text-[14px] leading-snug">
                    <span className="font-semibold mr-2">
                      {cmt.author?.userName || "User"}
                    </span>
                    {cmt.comment}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-[14px] italic">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="flex items-center gap-3 mt-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <img
              src={user?.profileImage || dp}
              alt="user"
              className="w-[35px] h-[35px] rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 outline-none text-[14px] bg-transparent placeholder-gray-400"
            />
            <button
              onClick={handleSendComment}
              className={`transition-all ${
                comment.trim() ? "text-black hover:text-gray-700" : "text-gray-400 cursor-default"
              }`}
            >
              <IoMdSend size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Post;
