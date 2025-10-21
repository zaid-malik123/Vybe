import { LuArrowLeft } from "react-icons/lu";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import ReelCard from "../components/ReelCard";

const Reels = () => {
  const { reels } = useSelector(state => state.reelSlice)
  const navigate = useNavigate()
  return (
    <div className='w-screen h-screen bg-black overflow-auto flex justify-center items-center'>
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]">
         <LuArrowLeft onClick={()=> navigate("/")} className="text-white cursor-pointer w-[25px] h-[25px]"/>
          <h1 className="text-white text-[20px] font-semibold">Reels</h1>
      </div>

     <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scroll-hide ">
       {reels.map((r,i)=>(
        <div className="h-screen snap-start" key={i}>
          <ReelCard reel={r}/>
        </div>
      ))}
     </div>
    </div>
  )
}

export default Reels
