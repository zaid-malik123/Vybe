import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";


const Message = () => {
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-screen flex flex-col bg-black gap-[20px] p-[20px]'>
        <div className="w-full max-w-[600px] flex items-center justify-between py-6 border-b border-gray-800">
        <button
          onClick={() => navigate(`/`)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-all lg:hidden"
        >
          <LuArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-lg font-semibold text-center flex-1 text-white">
          Messages
        </h2>
        {/* Empty placeholder to balance the layout */}
        <div className="w-[60px]"></div>
      </div>
    </div>
  )
}

export default Message
