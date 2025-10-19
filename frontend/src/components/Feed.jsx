import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";

const Feed = () => {
  const {post} = useSelector(state => state.postSlice)
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img className="w-[80px]" src={logo} alt="" />
        <div>
          <FaRegHeart color="white" size={20} />
        </div>
      </div>
      <div className="flex w-full overflow-auto gap-[20px] items-center p-[10px]">
        <StoryDp userName={"hello"}/>
      </div>
     
     <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
       <Nav/>
      {post?.map((post, idx)=>(
        <Post key={idx} post={post}/>
      ))}

     </div>

    </div>
  );
};

export default Feed;
