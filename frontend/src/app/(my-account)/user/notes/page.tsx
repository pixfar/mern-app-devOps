"use client";

import { useNotesQuery } from "@/redux/api/conversationApi";
import { isToken } from "@/services/auth.service";
import { HashLoader } from "react-spinners";

const UserNotes = () => {
  const token = isToken();
  const { data, isLoading } = useNotesQuery(token);
  // console.log(data);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );

  return (
    <div className="p-4">
      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto gap-4">
          {data?.payload?.data?.map((item: any) => (
            <div
              key={item._id}
              className=" glass w-full rounded-md bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary text-black dark:text-white"
            >
              <div className=" p-4  w-fit whitespace-break-spaces overflow-auto">
                {/* Use dangerouslySetInnerHTML to render raw HTML */}
                <div dangerouslySetInnerHTML={{ __html: item?.text }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded bg-red-400 text-red-800 w-fit mx-auto">Keine Notizen gefunden!</div>
      )}
    </div>
  );
};

export default UserNotes;
