/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  useAllConversationQuery,
  useEditConversationMutation,
} from "@/redux/api/conversationApi";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import ThemeToggler from "../Header/ThemeToggler";
import { RxCrossCircled } from "react-icons/rx";

interface RightSidebarProps {
  setConversationsID: React.Dispatch<React.SetStateAction<string>>;
  rightToggle: boolean;
  setRightToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const RightSidebar: React.FC<RightSidebarProps> = ({
  setConversationsID,
  rightToggle,
  setRightToggle,
}) => {
  const token = isToken();
  const { data: userData } = useGetUserQuery(token);
  const [page, setPage] = useState(1);
  const [conversations, setConversations] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editConversation] = useEditConversationMutation();
  const { data: responseData, isLoading } = useAllConversationQuery({
    token,
    page,
    limit: 25,
  });

  useEffect(() => {
    if (responseData?.payload?.data) {
      setConversations((prevConversations) => [
        ...prevConversations,
        ...responseData.payload.data,
      ]);
      if (responseData.payload.data.length < 25) setHasMore(false);
    }
  }, [responseData]);

  const handleScroll = () => {
    const bottomReached =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight;
    if (bottomReached && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, hasMore, isLoading]);

  const startEditing = (conversationId: string, currentName: string) => {
    setEditingId(conversationId);
    setEditedName(currentName);
  };

  const saveEditedName = async (conversationId: string) => {
    try {
      await editConversation({
        id: conversationId,
        token,
        data: { name: editedName },
      });
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv._id === conversationId ? { ...conv, name: editedName } : conv
        )
      );
    } catch (error) {
      console.error("Error updating conversation name:", error);
    } finally {
      setEditingId(null);
    }
  };

  return (
    <div
      className={`w-1/4 h-screen border-l border-secondary bg-primary dark:bg-black p-2 ${
        rightToggle ? "absolute z-auto w-full duration-300" : "hidden"
      } lg:flex flex-col overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-2 p-2 border dark:border-secondary bg-[#ffffff99] dark:bg-black rounded-md">
        <div className="flex items-center gap-2">
          <div>
            <div
              className="lg:hidden dark:text-white text-black text-xl"
              onClick={() => setRightToggle(false)}
            >
              <RxCrossCircled />
            </div>
          </div>
          <ThemeToggler />
        </div>
        <div className="dark:text-white text-black flex justify-center items-center gap-2">
          <h2 className="text-base">{userData?.payload[0]?.fullName}</h2>
          <MdAccountCircle size={25} />
        </div>
      </div>

      <div className="w-full border dark:border-secondary px-4 pt-4 rounded-lg bg-[#ffffff99] dark:bg-black flex flex-col h-full">
        {/* <div className="flex justify-between items-center mb-4 p-2 border border-secondary bg-primary dark:bg-black rounded-md">
          <button className="dark:text-white text-black flex justify-center items-center gap-2">
            <GoPlus size={30} />
            New chat
          </button>
        </div> */}

        <div className="flex-1 space-y-2 overflow-y-auto">
          {conversations.map((conversation, index) => {
            return (
              <div
                key={conversation._id + index}
                className="px-4 p-2 rounded-lg flex items-center justify-between gap-4 text-white"
              >
                <div className="flex items-center gap-4 dark:text-white text-black">
                  <FaRegMessage size={15} />
                  {editingId === conversation._id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-sm border rounded p-1 text-white w-36"
                    />
                  ) : (
                    <p
                      onClick={() => setConversationsID(conversation._id)}
                      className="text-sm  cursor-pointer"
                    >
                      {typeof conversation.name === "string" &&
                      conversation.name.trim() !== ""
                        ? conversation.name.length > 15
                          ? `${conversation.name.slice(0, 15)}...`
                          : conversation.name
                        : `Conversation ${index + 1}`}
                    </p>
                    // <p className="text-sm">{conversation._id}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingId === conversation._id ? (
                    <button
                      onClick={() => saveEditedName(conversation._id)}
                      className="text-sm text-blue-500"
                    >
                      Save
                    </button>
                  ) : (
                    <FiEdit
                      onClick={() =>
                        startEditing(conversation._id, conversation.name)
                      }
                      size={15}
                      className="cursor-pointer text-gray-500"
                    />
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && <p>Weitere Konversationen werden geladen...</p>}
          {/* {!hasMore && <p>No more conversations</p>} */}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
