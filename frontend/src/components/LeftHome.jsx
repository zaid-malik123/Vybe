import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUser } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtherUser from "./OtherUser";
const LeftHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, suggestedUser } = useSelector((state) => state.userSlice);

  const handleLogout = async () => {
    try {
      const res = axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUser(null));
      navigate("/login");
      toast.success("Logout Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[25%] hidden lg:block min-h-[100vh] bg-[black] border-r-2 border-gray-900">
      <div className="w-full h-[100px] flex items-center justify-between p-[20px]">
        <img className="w-[80px]" src={logo} alt="" />
        <div>
          <FaRegHeart color="white" size={20} />
        </div>
      </div>

      <div className="flex items-center gap-[10px] w-full justify-between px-[10px] border-b-2 border-gray-900 py-[10px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              className="w-full object-cover"
              src={user.profileImage || dp}
              alt=""
            />
          </div>

          <div>
            <div className="text-[18px] text-white font-semibold">
              {user.userName}
            </div>
            <div className="text-[12px] text-gray-400 font-semibold">
              {user.name}
            </div>
          </div>
        </div>

        <div
          onClick={handleLogout}
          className="text-blue-500 font-semibold cursor-pointer"
        >
          Log Out
        </div>
      </div>

      <div className="w-full flex flex-col gap-[20px] p-[20px]">
        <h1 className="text-[white] text-[19px]">Suggested User</h1>
        {suggestedUser && suggestedUser?.slice(0,3).map((user, idx)=>(
          <OtherUser key={idx} otherUser={user}/>
        ))}
      </div>
    </div>
  );
};

export default LeftHome;
