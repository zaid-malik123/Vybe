import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";

const OtherUser = ({otherUser}) => {
 const {user} = useSelector(state => state.userSlice)  
 const navigate = useNavigate()
  return (
    <div className="w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800">
      <div onClick={()=> navigate(`/profile/${otherUser.userName}`)} className="flex items-center gap-[10px]">
        <div className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            className="w-full object-cover"
            src={otherUser.profileImage || dp}
            alt=""
          />
        </div>

        <div>
          <div className="text-[15px] text-white font-semibold">
            {otherUser.userName}
          </div>
          <div className="text-[12px] text-gray-400 font-semibold">
            {otherUser.name}
          </div>
        </div>
      </div>
       <button className="px-[10px] w-[100px] py-[5px] h-[40px] bg-[white] rounded-2xl">Follow</button>
    </div>
  );
};

export default OtherUser;
