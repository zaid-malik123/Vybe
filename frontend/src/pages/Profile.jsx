import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUser } from "../redux/slice/userSlice";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import dp from "../assets/dp.webp";

const Profile = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileData } = useSelector((state) => state.userSlice);

  const handleProfile = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/user/user-profile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(res.data));
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="w-full h-[80px] flex justify-between items-center px-[30px] text-white">
        <div>
          <button
            onClick={() => navigate("/")}
            className="absolute top-7 left-6 flex items-center gap-2 text-white hover:text-gray-300 transition-all duration-300"
          >
            <LuArrowLeft size={25} />
          </button>
        </div>
        <div className="text-[15px] font-semibold">{profileData?.userName}</div>
        <div
          onClick={handleLogout}
          className="text-[15px] font-semibold text-blue-500 cursor-pointer"
        >
          Log Out
        </div>
      </div>

      <div className="w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
        <div className="w-[90px] h-[90px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            className="w-full object-cover"
            src={profileData?.profileImage || dp}
            alt=""
          />
        </div>
        <div>
            <div className="font-semibold text-[22px] text-white">{profileData?.name}</div>
            <div className="text-[17px] text-[#ffffffe8]">{profileData?.profession || "New User"}</div>
            <div className="text-[17px] text-[#ffffffe8]">{profileData?.bio}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
