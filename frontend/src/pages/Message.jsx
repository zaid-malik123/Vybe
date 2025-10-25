import { LuArrowLeft } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "../components/OnlineUsers";

const Message = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const { onlineUsers } = useSelector((state) => state.socketSlice);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black gap-[20px] p-[20px]">
      <div className="w-full max-w-[600px] flex items-center justify-between py-6 border-b border-gray-800">
        <button
          onClick={() => navigate(`/`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-all lg:hidden"
        >
          <LuArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-lg font-semibold text-center flex-1 text-white">
          Messages
        </h2>
        {/* Empty placeholder to balance the layout */}
        <div className="w-[60px]"></div>
      </div>

      <div className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800">
        {user?.following?.map(
          (user, idx) =>
            onlineUsers?.includes(user._id) && <OnlineUsers user={user} />
        )}
      </div>
    </div>
  );
};

export default Message;
