/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  useLazyDownloadPDFQuery,
  useNoteDeleteMutation,
} from "@/redux/api/conversationApi";
import { isToken } from "@/services/auth.service";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { toast } from "react-toastify";
import NoteModal from "../Shared/Modal/NoteModal";
import { FaAlignLeft, FaAlignRight } from "react-icons/fa6";

interface ChatAreaProps {
  streamedOutput: any[];
  conversationsID: string;
  setLeftChatToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setRightToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const splitContentIntoSections = (content: string) => {
  const regex = /\(\d+\)/g;
  const sections = content.split(regex);

  const matches = content.match(regex);

  if (matches) {
    return sections
      .map((section, index) => {
        if (index === 0) return section.trim();
        return `${matches[index - 1]} ${section.trim()}`;
      })
      .filter((section) => section !== "");
  }

  return [content];
};

const ChatArea: React.FC<ChatAreaProps> = ({
  streamedOutput,
  conversationsID,
  setRightToggle,
  setLeftChatToggle,
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const token = isToken();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [responseId, setResponseID] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyStreamed, setHistoryStreamed] = useState<any[]>([]);
  const [noteDelete, { isError, isLoading: isChatLoading }] =
    useNoteDeleteMutation();

  const openNoteModal = (conversationId: string, responseId: string) => {
    setCurrentConversationId(conversationId);
    setResponseID(responseId);
    setIsNoteModalOpen(true);
  };

  const [triggerDownloadPDF, { data, isLoading, error: errorDownload }] =
    useLazyDownloadPDFQuery();
  const error: any = errorDownload;
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamedOutput]);

  const conversationId =
    historyStreamed.length > 0
      ? historyStreamed[0]?._id
      : streamedOutput[0]?._id;

  const downloadPDF = async (conversationId: any) => {
    try {
      setDownloadLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/model/conversation/${conversationId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `conversation_${conversationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadLoading(false);
    } catch (error) {
      setDownloadLoading(false);
      console.error("Error downloading PDF:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  useEffect(() => {
    const handleHistoryConversation = async () => {
      if (conversationsID) {
        setHistoryStreamed([]);
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/model/conversation/${conversationsID}`,
            {
              method: "GET",
              headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let streamedResponse = "";
            let output = [];

            while (true) {
              const { done, value } = await reader.read();
              streamedResponse += !done
                ? decoder.decode(value, { stream: true })
                : "";

              output = [];
              let lastJsonString = streamedResponse.split("}{").pop();
              let jsonStrings = streamedResponse
                .split("}{")
                .filter((item) =>
                  !done ? item != lastJsonString : item != ""
                );

              if (jsonStrings.length > 1) {
                jsonStrings = jsonStrings.map((chunk, index, array) => {
                  if (index === 0) return chunk + "}";
                  if (index === array.length - 1) return "{" + chunk;
                  return "{" + chunk + "}";
                });
              }
              // // Merge back split JSON objects correctly
              if (jsonStrings.length > 1) {
                let resultObject = jsonStrings.map((item) => {
                  try {
                    item = item.replace(/\\?\n/g, "\\n");
                    return JSON.parse(item);
                  } catch (err) {
                    // Nothing to do here
                  }
                });

                // Filter out undefined values (in case JSON.parse failed for some items)
                resultObject = resultObject.filter(
                  (item) => item !== undefined
                );

                // Update state
                setHistoryStreamed(resultObject);
              }

              if (done) break;
            }

            setLoading(false);
          } else {
            console.error("Response body is null.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    if (conversationsID) {
      handleHistoryConversation();
    }
  }, [conversationsID]);

  const handleNoteDelete = async (id: string) => {
    await noteDelete({ id, token });
  };

  return (
    <>
      <div className="flex justify-between items-center md:justify-end p-5 lg:hidden dark:text-white text-black">
        <div className="md:hidden" onClick={() => setLeftChatToggle(true)}>
          <FaAlignLeft />
        </div>
        <div className="" onClick={() => setRightToggle(true)}>
          <FaAlignRight />
        </div>
      </div>
      <div className="flex flex-col h-screen p-1">
        <div className="flex-grow flex flex-col space-y-4 overflow-y-auto scrollbar-custom">
          <div className="p-4 rounded-lg">
            {historyStreamed.length > 0 ||
            (streamedOutput.length > 0 &&
              !streamedOutput[streamedOutput.length - 1].error) ? (
              <div className="flex justify-end items-center gap-2 mb-2">
                <div
                  className="tooltip tooltip-left tooltip-secondary"
                  data-tip="Download"
                >
                  <button
                    disabled={downloadLoading}
                    onClick={() => downloadPDF(conversationId)}
                    className="btn btn-sm"
                  >
                    Download <FaCloudDownloadAlt />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {historyStreamed.length > 0 || streamedOutput.length > 0 ? (
                  <p className="text-center font-semibold">
                    Keine Referenz gefunden, Bitte versuchen Sie es mit einer
                    gültigen Referenzdatei!
                  </p>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    {/* <p className="font-bold mb-3">German Law AI</p> */}
                    <Image
                      src="/images/logo/logo.png"
                      alt="logo"
                      width={80}
                      height={80}
                    />
                  </div>
                )}
              </div>
            )}

            {historyStreamed.length > 0 ||
            (streamedOutput.length > 0 &&
              !streamedOutput[streamedOutput.length - 1]?.error) ? (
              (historyStreamed.length > 0
                ? historyStreamed
                : streamedOutput
              ).map((item, index) =>
                item?.result ? (
                  <div
                    key={index}
                    className="mb-4 border p-3 rounded-md border-[#00000030] dark:border-secondary"
                  >
                    <div className="flex justify-end items-center">
                      <div
                        className="tooltip tooltip-left tooltip-secondary"
                        data-tip="Mitschrift"
                      >
                        <button
                          onClick={() => {
                            openNoteModal(
                              historyStreamed.length > 0
                                ? historyStreamed[0]?._id
                                : streamedOutput[0]?._id,
                              item?._id
                            );
                          }}
                          className="btn btn-sm"
                        >
                          <RiStickyNoteAddFill />
                        </button>
                      </div>
                    </div>
                    <p className="text-2xl mb-2 font-bold">Stelle im Script</p>
                    <h3 className="font-bold text-xl mb-3">
                      {item?.fullLine_String}
                    </h3>
                    <div className="divider bg-[#00000030] h-[1px]"></div>
                    <p className="text-2xl mb-2 font-bold">Gesetzestext</p>
                    <p className="mb-2 text-2xl italic font-bold">
                      {item?.result?.sectionTitle}
                    </p>

                    <ul className="list-disc pl-5">
                      {splitContentIntoSections(
                        item?.result?.contents_string
                      ).map((section, i) => (
                        <li key={i} className="text-lg mb-2">
                          {section}
                        </li>
                      ))}
                    </ul>
                    {item.note && (
                      <div className="border border-[#00000030] dark:border-secondary p-4 mt-2 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-2xl mb-2 font-bold">Note:</h4>
                            <p className="text-lg">{item.note?.text}</p>
                          </div>
                          <AiFillDelete
                            onClick={() => handleNoteDelete(item.note?._id)}
                            className="text-red-500 text-xl cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : null
              )
            ) : (
              <>
                {historyStreamed.length > 0 ||
                (streamedOutput.length > 0 &&
                  !streamedOutput[streamedOutput.length - 1].error) ? (
                  <div className="flex flex-col justify-center items-center">
                    {/* <p className="font-bold mb-3">German Law AI</p> */}
                    <Image
                      src="/images/logo/logo.png"
                      alt="logo"
                      width={80}
                      height={80}
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        </div>
      </div>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        conversationId={currentConversationId}
        responseId={responseId}
      />
    </>
  );
};

export default ChatArea;
