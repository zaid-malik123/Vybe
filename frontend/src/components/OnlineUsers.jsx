import { useDispatch } from "react-redux";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/slice/messageSlice";

const OnlineUsers = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedUser(user));
    navigate(`/message-area`);
  };

  return (
    <div className="relative w-[60px] h-[60px] flex-shrink-0">
      {/* Profile Image */}
      <div
        onClick={handleClick}
        className="w-full h-full rounded-full border-2 border-gray-700 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 shadow-md"
      >
        <img
          src={user.profileImage || dp}
          alt={user.userName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Online Dot */}
      <div className="absolute w-[13px] h-[13px] bg-[#0080ff] rounded-full border-2 border-black bottom-1 right-1" />
    </div>
  );
};

export default OnlineUsers;
