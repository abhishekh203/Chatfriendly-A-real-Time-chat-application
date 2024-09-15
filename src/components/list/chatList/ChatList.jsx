  import { useEffect, useState } from "react";
  import { useUserStore } from "../../../lib/userStore";
  import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
  import { db } from "../../../lib/firebase";
  import { useChatStore } from "../../../lib/chatStore";
  import AddUser from "./addUser/addUser";
  import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
  import "./chatList.css"; // Import the CSS file

  const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();

    useEffect(() => {
      const unSub = onSnapshot(
        doc(db, "userchats", currentUser.id),
        async (res) => {
          const items = res.data().chats;

          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data();

            return { ...item, user };
          });

          const chatData = await Promise.all(promises);

          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      );

      return () => {
        unSub();
      };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
      const userChats = chats.map((item) => {
        const { user, ...rest } = item;
        return rest;
      });

      const chatIndex = userChats.findIndex(
        (item) => item.chatId === chat.chatId
      );

      userChats[chatIndex].isSeen = true;

      const userChatsRef = doc(db, "userchats", currentUser.id);

      try {
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.log(err);
      }
    };

    const filteredChats = chats.filter((c) =>
      c.user.username.toLowerCase().includes(input.toLowerCase())
    );

    return (
      <div className="chatList">
        <div className="search">
          <div className="searchBar">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="add" onClick={() => setAddMode((prev) => !prev)}>
            {addMode ? <FaMinus className="text-gray-500" /> : <FaPlus className="text-gray-500" />}
          </div>
        </div>
        <div className="items">
          {filteredChats.map((chat) => (
            <div
              key={chat.chatId}
              className="item"
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat.isSeen ? "transparent" : "#e5f5e0",
              }}
            >
              <img
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? "./avatar.png"
                    : chat.user.avatar || "./avatar.png"
                }
                alt="User Avatar"
              />
              <div className="texts">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  
                  <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                </div>
                <p>{chat.lastMessage}</p>
              </div>
              <span className="text-gray-500 text-sm">
                {new Date(chat.updatedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
        {addMode && <AddUser />}
      </div>
    );
  };

  export default ChatList;
