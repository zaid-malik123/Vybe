import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
const Notification = () => {
  const navigate = useNavigate()  
  return (
    <div className="w-full h-[100vh] bg-black">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]">
        <LuArrowLeft
          onClick={() => navigate("/")}
          className="text-white cursor-pointer w-[25px] h-[25px]"
        />
      </div>
    </div>
  );
};

export default Notification;
