import { LuArrowLeft } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/slice/userSlice";
import dp from "../assets/dp.webp";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const { searchData } = useSelector((state) => state.userSlice);

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        dispatch(setSearchData([]));
        return;
      }
      const res = await axios.get(
        `${serverUrl}/api/user/search?query=${query}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 400); // debounce to reduce API calls while typing

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center gap-4 px-5 py-4 fixed top-0 left-0 bg-black/60 backdrop-blur-md border-b border-gray-800 z-50">
        <LuArrowLeft
          onClick={() => navigate("/")}
          className="text-white cursor-pointer w-6 h-6 hover:text-gray-400 transition"
        />
        <h1 className="text-lg font-semibold tracking-wide">Search</h1>
      </div>

      {/* Search bar */}
      <div className="w-full flex justify-center mt-[100px] px-5">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-xl bg-[#121616] flex items-center gap-3 rounded-full px-5 py-3 border border-gray-800 focus-within:border-gray-600 transition"
        >
          <IoIosSearch className="text-gray-400" size={22} />
          <input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            type="text"
            placeholder="Search users"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-base"
          />
        </form>
      </div>

      {/* Results */}
      <div className="w-full max-w-xl mt-6 px-5 pb-20">
        {query === "" ? (
          <p className="text-gray-500 text-center text-sm mt-10">
            Type something to search 🔍
          </p>
        ) : searchData?.length === 0 ? (
          <p className="text-gray-500 text-center text-sm mt-10">
            No users found 😕
          </p>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {searchData?.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/profile/${user.userName}`)}
                className="flex items-center gap-4 bg-[#121212] hover:bg-[#1a1a1a] transition rounded-xl px-4 py-3 cursor-pointer border border-gray-800"
              >
                <img
                  src={user.profileImage || dp}
                  alt={user.userName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-base">{user.userName}</span>
                  <span className="text-sm text-gray-400">{user.name}</span>
                  {user.bio && (
                    <span className="text-xs text-gray-500 truncate max-w-[220px]">
                      {user.bio}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
