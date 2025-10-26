import dp from "../assets/dp.webp";
import moment from "moment";
import { MdPlayCircleFilled } from "react-icons/md"; // for video icon

const NotificationCard = ({ noti }) => {
  const { sender, message, createdAt, post, type, isRead } = noti;

  // Check if the post has an image type
  const isImage = post?.mediaType === "image";
  const isVideo = post?.mediaType === "video";

  return (
    <div
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer
      ${isRead ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700`}
    >
      {/* Left side - Sender Info */}
      <div className="flex items-center gap-3">
        {/* Sender Profile */}
        <img
          src={sender?.profileImage || dp}
          alt="profile"
          className="w-[45px] h-[45px] rounded-full object-cover border border-gray-600"
        />

        {/* Message */}
        <div className="flex flex-col">
          <p className="text-white text-sm leading-tight">
            <span className="font-semibold">{sender?.userName}</span> {message}
          </p>
          <span className="text-gray-400 text-xs mt-[3px]">
            {moment(createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Right side - Post Preview */}
      {isImage && post?.media && (
        <img
          src={post.media}
          alt="post"
          className="w-[45px] h-[45px] rounded-md object-cover"
        />
      )}

      {isVideo && (
        <div className="w-[45px] h-[45px] bg-gray-700 flex items-center justify-center rounded-md">
          <MdPlayCircleFilled className="text-white text-2xl" />
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
