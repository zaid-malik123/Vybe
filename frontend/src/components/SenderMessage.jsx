import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";
const SenderMessage = ({ message }) => {
  const { user } = useSelector((state) => state.userSlice);

  return (
    <div className="relative flex justify-end mb-6">
      <div className="max-w-[60%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] text-white rounded-2xl rounded-br-sm p-3 flex flex-col gap-2 shadow-md">
        {message.image && (
          <img
            className="h-[200px] w-full object-cover rounded-xl"
            src={message.image}
            alt=""
          />
        )}
        {message.message && (
          <div className="text-[16px] leading-tight break-words">
            {message.message}
          </div>
        )}
      </div>

      <div className="w-[32px] h-[32px] rounded-full overflow-hidden ml-2 mt-auto shadow-md">
        <img
          className="w-full h-full object-cover"
          src={user.profileImage || dp}
          alt=""
        />
      </div>
    </div>
  );
};

export default SenderMessage;
