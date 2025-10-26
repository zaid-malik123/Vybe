import { useDispatch, useSelector } from "react-redux";
import { LuArrowLeft, LuSend, LuX } from "react-icons/lu";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import SenderMessage from "../components/SenderMessage";
import RecieverMessage from "../components/RecieverMessage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setMessages } from "../redux/slice/messageSlice";

const MessageArea = () => {
  const { selectedUser, messages } = useSelector((state) => state.messageSlice);
  const { socket } = useSelector((state) => state.socketSlice);
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const imageInput = useRef();
  const scrollRef = useRef(null);
  const [message, setMessage] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", message);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
      dispatch(setMessages([...messages, res.data]));
      setMessage("");
      setFrontendImage(null);
      setBackendImage(null);
      imageInput.current.value = null;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleAllMessages().then(() => {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "auto",
        });
      }, 300);
    });
  }, [selectedUser]);

  // Jab bhi messages update honge to auto scroll karega
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // smooth scroll effect
      });
    }
  }, [messages]);

  const handleAllMessages = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/message/all-message/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleAllMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMsg", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });

    return () => socket.off("newMsg");
  }, [socket, dispatch, messages]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#050505] to-[#0f0f0f] relative flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3 fixed top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/10 shadow-sm">
        <LuArrowLeft
          onClick={() => navigate("/message")}
          size={26}
          className="text-white cursor-pointer hover:text-gray-400 transition"
        />

        {/* Profile */}
        <div
          onClick={() => navigate(`/profile/${selectedUser.userName}`)}
          className="w-[45px] h-[45px] rounded-full overflow-hidden border border-gray-700 cursor-pointer hover:scale-105 transition"
        >
          <img
            className="w-full h-full object-cover"
            src={selectedUser.profileImage || dp}
            alt=""
          />
        </div>

        <div className="text-white">
          <div className="text-[16px] font-semibold">
            {selectedUser.userName}
          </div>
          <div className="text-[13px] text-gray-400">{selectedUser.name}</div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        onChange={handleImage}
        ref={imageInput}
        type="file"
        hidden
        accept="image/*"
      />

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 pt-[80px] pb-[100px] flex flex-col gap-6 bg-black scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
      >
        {Array.isArray(messages) &&
          messages.map((mess, idx) =>
            mess.sender === user._id ? (
              <SenderMessage key={idx} message={mess} />
            ) : (
              <RecieverMessage key={idx} message={mess} />
            )
          )}
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 w-full z-50 bg-black/50 backdrop-blur-md border-t border-white/10 py-3 flex justify-center">
        <form
          onSubmit={handleSendMessage}
          className="relative w-[92%] max-w-[850px] flex items-center gap-3 bg-[#151515] rounded-full px-5 py-2 border border-white/10 shadow-lg shadow-black/40"
        >
          {/* Image Preview */}
          {frontendImage && (
            <div className="absolute bottom-[70px] right-[15px] bg-[#111] p-1 rounded-2xl shadow-md border border-white/10">
              <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden">
                <img
                  src={frontendImage}
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
                <LuX
                  onClick={() => {
                    setFrontendImage(null);
                    setBackendImage(null);
                  }}
                  className="absolute top-1 right-1 text-white bg-black/60 rounded-full cursor-pointer hover:bg-red-600 transition"
                  size={20}
                />
              </div>
            </div>
          )}

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white text-[16px] placeholder-gray-500"
            type="text"
            placeholder="Type a message..."
          />

          <MdPhotoSizeSelectActual
            onClick={() => imageInput.current.click()}
            className="text-gray-300 hover:text-white cursor-pointer transition transform hover:scale-110"
            size={28}
          />

          {(message.trim() || backendImage) && (
            <button
              type="submit"
              className="w-[45px] h-[45px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#a100ff] to-[#ff0084] hover:opacity-90 hover:scale-105 transition active:scale-95"
            >
              <LuSend color="white" size={22} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
