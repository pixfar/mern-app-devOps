import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary"></div>
    </div>
  );
};

export default Loading;
