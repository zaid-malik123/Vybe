import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../components/OnlineUsers";
import dp from "../assets/dp.webp";
import { setSelectedUser } from "../redux/slice/messageSlice";

const Message = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { onlineUsers } = useSelector((state) => state.socketSlice);
  const { prevChatUsers } = useSelector((state) => state.messageSlice);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#000] text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <button
          onClick={() => navigate(`/`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-all lg:hidden"
        >
          <LuArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-xl font-semibold flex-1 text-center">Messages</h2>
        <div className="w-[50px]" />
      </div>

      {/* Online Users */}
      {onlineUsers && <div className="flex gap-4 overflow-x-auto mt-5 pb-4 border-b border-gray-800 no-scrollbar">
        {user?.following?.map(
          (followedUser, idx) =>
            onlineUsers?.includes(followedUser._id) && (
              <div
                key={idx}
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={followedUser.profileImage || dp}
                    alt={followedUser.userName}
                    className="w-[65px] h-[65px] rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="absolute bottom-[3px] right-[3px] w-[12px] h-[12px] bg-green-500 border-2 border-black rounded-full"></span>
                </div>
                <p className="text-sm mt-1 text-gray-300">{followedUser.userName}</p>
              </div>
            )
        )}
      </div>}

      {/* Previous Chats */}
      <div className="flex flex-col mt-4 gap-3 overflow-auto pb-20 no-scrollbar">
        {prevChatUsers?.length > 0 ? (
          prevChatUsers.map((chatUser, idx) => (
            <div
              key={idx}
              onClick={() => {
                dispatch(setSelectedUser(chatUser));
                navigate(`/message-area`);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#111] transition-all cursor-pointer"
            >
              <div className="relative">
                <img
                  src={chatUser.profileImage || dp}
                  alt={chatUser.userName}
                  className="w-[55px] h-[55px] rounded-full object-cover border border-gray-800"
                />
                {onlineUsers?.includes(chatUser._id) && (
                  <span className="absolute bottom-[3px] right-[3px] w-[12px] h-[12px] bg-green-500 border-2 border-black rounded-full"></span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-[17px] font-medium">
                  {chatUser.userName}
                </span>
                {onlineUsers?.includes(chatUser._id) ? (
                  <span className="text-blue-500 text-[14px]">Active now</span>
                ) : (
                  <span className="text-gray-400 text-[14px]">
                    Last seen recently
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20">
            No previous chats yet 😅
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
