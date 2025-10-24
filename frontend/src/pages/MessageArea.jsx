import { useSelector } from "react-redux";
import { LuArrowLeft, LuSend } from "react-icons/lu";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";

const MessageArea = () => {
  const { selectedUser } = useSelector((state) => state.messageSlice);
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-[#0a0a0a] relative flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 fixed top-0 z-50 w-full backdrop-blur-md bg-black/40 border-b border-white/10">
        {/* Back button */}
        <LuArrowLeft
          onClick={() => navigate("/")}
          size={25}
          className="text-white cursor-pointer hover:text-gray-400 transition"
        />

        {/* Profile Image */}
        <div
          onClick={() => navigate(`/profile/${selectedUser.userName}`)}
          className="w-[45px] h-[45px] rounded-full overflow-hidden border border-gray-600 cursor-pointer hover:scale-105 transition"
        >
          <img
            className="w-full h-full object-cover"
            src={selectedUser.profileImage || dp}
            alt=""
          />
        </div>

        {/* User Info */}
        <div className="text-white">
          <div className="text-[16px] font-semibold">{selectedUser.userName}</div>
          <div className="text-[13px] text-gray-400">{selectedUser.name}</div>
        </div>
      </div>

      {/* Messages Area (Placeholder) */}
      <div className="flex-1 overflow-y-auto mt-[70px] mb-[90px] p-4 text-gray-200">
        {/* Chat messages will go here */}
        <div className="flex justify-center text-gray-500 text-sm mt-10">
          Start a conversation with {selectedUser.userName} 💬
        </div>
      </div>

      {/* Message Input */}
      <div className="w-full fixed bottom-0 z-50 bg-black/40 backdrop-blur-md border-t border-white/10 py-3 flex justify-center">
        <form className="w-[92%] max-w-[850px] flex items-center gap-3 bg-[#121212] rounded-full px-5 py-2 border border-white/10 shadow-md">
          <input
            className="flex-1 bg-transparent outline-none text-white text-[16px] placeholder-gray-400"
            type="text"
            placeholder="Type a message..."
          />
          <MdPhotoSizeSelectActual
            className="text-gray-300 hover:text-white cursor-pointer transition"
            size={28}
          />
          <button
            type="submit"
            className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#a100ff] to-[#ff0084] hover:scale-105 transition"
          >
            <LuSend color="white" size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
