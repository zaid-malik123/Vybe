import axios from "axios";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { useRef, useState } from "react";
import { serverUrl } from "../App";
import { setProfileData, setUser } from "../redux/slice/userSlice";
import { ClipLoader } from "react-spinners";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => state.userSlice);
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(user.profileImage || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState(user.name || "");
  const [userName, setUserName] = useState(user.userName || "");
  const [profession, setProfession] = useState(user.profession || "");
  const [bio, setBio] = useState(user.bio || "")
  const [gender, setGender] = useState(user.gender || "")

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEditProfile = async (e)=>{
    try {
      setLoading(true)  
      const formData = new FormData()
      formData.append("profileImage", backendImage)
      formData.append("name", name)
      formData.append("userName", userName)
      formData.append("bio", bio)
      formData.append("profession", profession)
      formData.append("gender", gender)
      
      const res = await axios.post(`${serverUrl}/api/user/edit-profile`, formData, {withCredentials:true})
      
      dispatch(setUser(res.data))
      dispatch(setProfileData(res.data))
      navigate(`/profile/${user.userName}`)
      setLoading(false)
    } catch (error) {
      setLoading(false)  
      console.log(error)  
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center text-white px-4">
      {/* Header */}
      <div className="w-full max-w-[600px] flex items-center justify-between py-6 border-b border-gray-800">
        <button
          onClick={() => navigate(`/profile/${user.userName}`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-all"
        >
          <LuArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-lg font-semibold text-center flex-1">
          Edit Profile
        </h2>
        {/* Empty placeholder to balance the layout */}
        <div className="w-[60px]"></div>
      </div>

      {/* Hidden File Input */}
      <input
        onChange={handleImage}
        hidden
        type="file"
        accept="image/*"
        ref={imageInput}
      />

      {/* Profile Picture */}
      <div className="flex flex-col items-center mt-10">
        <div
          onClick={() => imageInput.current.click()}
          className="relative group cursor-pointer"
        >
          <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-blue-500 transition-all duration-300">
            <img
              className="w-full h-full object-cover"
              src={frontendImage}
              alt="profile"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-sm text-blue-400 font-medium">Change</p>
          </div>
        </div>
        <p
          onClick={() => imageInput.current.click()}
          className="text-blue-500 text-center text-[16px] font-semibold mt-3 hover:underline cursor-pointer"
        >
          Change Profile Picture
        </p>
      </div>

      {/* Form */}
      <div  className="w-full max-w-[600px] flex flex-col gap-5 mt-10">
        {/* Full Name */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
          <input
            placeholder="Enter your name"
            className="w-full h-[50px] bg-[#111315] border border-gray-700 rounded-lg px-4 text-white font-medium focus:border-blue-500 focus:outline-none transition-all"
            type="text"
            value={name}
            onChange={(e)=> setName(e.target.value)}
          />
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Username</label>
          <input
            placeholder="Enter your username"
            className="w-full h-[50px] bg-[#111315] border border-gray-700 rounded-lg px-4 text-white font-medium focus:border-blue-500 focus:outline-none transition-all"
            type="text"
            value={userName}
            onChange={(e)=> setUserName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Bio</label>
          <textarea
            placeholder="Write something about yourself..."
            rows={3}
            value={bio}
            onChange={(e)=> setBio(e.target.value)}
            className="w-full bg-[#111315] border border-gray-700 rounded-lg px-4 py-3 text-white font-medium focus:border-blue-500 focus:outline-none transition-all resize-none"
          ></textarea>
        </div>

        {/* Profession */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Profession</label>
          <input
            placeholder="Enter your profession"
            className="w-full h-[50px] bg-[#111315] border border-gray-700 rounded-lg px-4 text-white font-medium focus:border-blue-500 focus:outline-none transition-all"
            type="text"
            value={profession}
            onChange={(e)=> setProfession(e.target.value)}
          />
        </div>

        {/* Gender */}
       <div>
          <label className="text-sm text-gray-400 mb-1 block">Gender</label>
          <input
            placeholder="Enter your Gender"
            className="w-full h-[50px] bg-[#111315] border border-gray-700 rounded-lg px-4 text-white font-medium focus:border-blue-500 focus:outline-none transition-all"
            type="text"
            value={gender}
            onChange={(e)=> setGender(e.target.value)}
          />
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleEditProfile} className="w-full max-w-[600px] mt-10 h-[55px] bg-white rounded-xl font-semibold text-black shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mb-[30px]">
       {loading ? <ClipLoader color="black"/> : "Save Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
