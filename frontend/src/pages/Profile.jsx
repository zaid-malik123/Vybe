import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUser } from "../redux/slice/userSlice";
import { useEffect, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import FollowBtn from "../components/FollowBtn";
import Post from "../components/Post";
import { toast } from "react-toastify";

const Profile = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ useState instead of useSelector (you wrote it wrong before)
  const [postType, setPostType] = useState("post");

  const { profileData, user } = useSelector((state) => state.userSlice);
  const { posts } = useSelector((state) => state.postSlice);

  // ✅ Filter posts of this profile
  const userPost = posts.filter((p) => p.author?._id === profileData?._id);

  // ✅ Fetch profile data
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

  // ✅ Logout logic
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
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
    <div className="w-full min-h-screen bg-black text-white">
      {/* 🔹 Top bar */}
      <div className="w-full h-[80px] flex items-center justify-center relative px-[30px]">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-6 flex items-center gap-2 hover:text-gray-300 transition-all duration-300"
        >
          <LuArrowLeft size={25} />
        </button>

        {/* Username Center */}
        <div className="text-[15px] font-semibold text-center">
          {profileData?.userName}
        </div>

        {/* Logout Button Right */}
        <div
          onClick={handleLogout}
          className="absolute right-6 text-[15px] font-semibold text-blue-500 cursor-pointer"
        >
          Log Out
        </div>
      </div>

      {/* 🔹 Profile Info */}
      <div className="w-full h-auto flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 pt-4 px-4 justify-center">
        <div className="w-[90px] h-[90px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={profileData?.profileImage || dp}
            alt="profile"
          />
        </div>

        <div className="flex flex-col text-center md:text-left">
          <div className="font-semibold text-[22px]">{profileData?.name}</div>
          <div className="text-[17px] text-[#ffffffe8]">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-[#ffffffe8] max-w-[300px] md:max-w-[500px] truncate">
            {profileData?.bio}
          </div>
        </div>
      </div>

      {/* 🔹 Stats */}
      <div className="w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20px] pt-[30px]">
        {/* Posts */}
        <div className="text-center">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
            Posts
          </div>
        </div>

        {/* Followers */}
        <div className="text-center">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.followers?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
            Followers
          </div>
        </div>

        {/* Following */}
        <div className="text-center">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.following?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
            Following
          </div>
        </div>
      </div>

      {/* 🔹 Action Buttons */}
      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]">
        {profileData?._id === user?._id ? (
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white text-black cursor-pointer rounded-2xl"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-[20px]">
            <FollowBtn
              targetUserId={profileData?._id}
              tailwind="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white text-black cursor-pointer rounded-2xl"
              onFollowChange={handleProfile}
            />
            <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white text-black cursor-pointer rounded-2xl">
              Message
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Posts / Saved toggle */}
      {profileData?._id == user?._id && (
        <div className="w-full flex justify-center mt-[20px] mb-[10px]">
          <div className="w-[90%] max-w-[600px] h-[70px] bg-white/10 rounded-full flex justify-around items-center gap-[10px] backdrop-blur-sm border border-gray-800">
            {["post", "save"].map((type) => (
              <div
                key={type}
                onClick={() => setPostType(type)}
                className={`${
                  postType === type
                    ? "bg-white text-black font-semibold"
                    : "text-white"
                } w-[45%] h-[80%] flex justify-center items-center text-[17px] rounded-full cursor-pointer transition-all hover:bg-white hover:text-black`}
              >
                {type === "post" ? "All Posts" : "Saved Posts"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Post List */}
      <div className="w-full min-h-[100vh] flex justify-center ">
        <div className="w-full max-w-[900px] text-black flex flex-col items-center rounded-t-[30px] bg-[#0f0f0f] relative gap-[20px]  mb-[50px] p-[20px]">
          <Nav />
          {postType === "post" ? (
            userPost.length > 0 ? (
              userPost.map((post) => <Post key={post._id} post={post} />)
            ) : (
              <div className="text-gray-600 py-10">No posts yet</div>
            )
          ) : profileData?.saved?.length > 0 ? (
            profileData.saved.map((post) => {
              console.log("This data is passed from Profile ", post);
              return <Post key={post._id} post={post} />;
            })
          ) : (
            <div className="text-gray-600 py-10">No saved posts yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
