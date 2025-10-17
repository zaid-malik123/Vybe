import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUser } from "../redux/slice/userSlice";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";

const Profile = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileData, user } = useSelector((state) => state.userSlice);

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
          <div className="font-semibold text-[22px] text-white">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">{profileData?.bio}</div>
        </div>

      </div>

      <div className="w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20px] pt-[30px] text-white">
        <div>
          <div className="text-white text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts?.length}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
            Posts
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
           
                <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                  <img
                    className="w-full object-cover"
                    src={user.profileImage || dp}
                    alt=""
                  />
                </div>
                 <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden absolute left-[9px]">
                  <img
                    className="w-full object-cover"
                    src={user.profileImage || dp}
                    alt=""
                  />
                </div>
                 <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden absolute left-[18px]">
                  <img
                    className="w-full object-cover"
                    src={user.profileImage || dp}
                    alt=""
                  />
                </div>
            
            </div>
            <div  className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers?.length}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">Followers</div>
        </div>
        <div >
           <div  className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
           
                <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                  <img
                    className="w-full object-cover"
                    src={user.profileImage || dp}
                    alt=""
                  />
                </div>
                 <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden absolute left-[9px]">
                  <img
                    className="w-full object-cover"
                    src={user.profileImage || dp}
                    alt=""
                  />
                </div>
                 <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden absolute left-[18px]">
                  <img
                    className="w-full object-cover"
                    src={user.profileImage || dp}
                    alt=""
                  />
                </div>
            
            </div>
            <div  className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers?.length}
            </div>
           </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">Following</div>
        </div>
      </div>

      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]">
       {profileData?._id === user._id && (
        <div>
          <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl">Edit Profile</button>
        </div>
       )}
       {profileData?._id != user._id && (
        <div className="flex gap-[20px]">
          <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl">Follow</button>
          <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl">Message</button>
        </div>
       )}
      </div>

      <div className="w-full min-h-[100vh] flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px]">
          <Nav/>
        </div>
      </div>

    </div>
  );
};

export default Profile;
