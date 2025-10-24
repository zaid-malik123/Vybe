import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";
const ReceiverMessage = ({ message }) => {
  const { user } = useSelector((state) => state.userSlice);
  const {selectedUser} = useSelector((state => state.messageSlice))

  return (
    <div className="relative flex justify-start mb-6">
      {/* Profile Image (left side) */}
      <div className="w-[32px] h-[32px] rounded-full overflow-hidden mr-2 mt-auto shadow-md">
        <img
          className="w-full h-full object-cover"
          src={selectedUser?.profileImage || dp}
          alt=""
        />
      </div>

      {/* Message Box */}
      <div className="max-w-[60%] bg-[#1a1f1f] text-white rounded-2xl rounded-bl-sm p-3 flex flex-col gap-2 shadow-md">
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
    </div>
  );
};

export default ReceiverMessage;
