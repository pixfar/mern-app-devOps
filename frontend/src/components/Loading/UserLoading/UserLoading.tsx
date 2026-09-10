import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const LoadingData = () => {
  return (
    <div>
      <div className="p-4 bg-orange-200/50 dark:bg-gradient-to-r from-primary to-secondary text-center mb-10">
        <h2 className="bg-gray-200 w-fit h-fit rounded animate-pulse"></h2>
      </div>
      <div className="overflow-x-auto animate-pulse bg-orange-200/50  dark:bg-gradient-to-r from-primary to-secondary p-4 rounded-lg border mb-2">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="border-gray-200 animate-pulse">
              <th className="bg-gray-200 w-fit h-fit rounded"></th>
              <th className="bg-gray-200 w-fit h-fit rounded"></th>
              <th className="bg-gray-200 w-fit h-fit rounded"></th>
              <th className="bg-gray-200 w-fit h-fit rounded"></th>
              <th className="bg-gray-200 w-fit h-fit rounded"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-gray-200 animate-pulse">
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
            </tr>
            <tr className="border-gray-200 animate-pulse">
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
              <td className="bg-gray-200 w-fit h-fit rounded"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadingData;
