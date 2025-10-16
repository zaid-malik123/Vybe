import { MdHomeFilled } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";

const Nav = () => {
 const {user} = useSelector(state => state.userSlice)  
  return (
    <div className="w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-[#000000] shadow-2xl z-[100]">
      <div>
        <MdHomeFilled color="white" size={25} />
      </div>
      <div>
        <IoSearch color="white" size={25} />
      </div>
      <div>
        <FaPlus color="white" size={25} />
      </div>
      <div>
        <BiSolidVideos color="white" size={25} />
      </div>
      <div className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
        <img
          className="w-full object-cover"
          src={user.profileImage || dp}
          alt=""
        />
      </div>
    </div>
  );
};

export default Nav;
