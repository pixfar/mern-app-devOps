import { big_shoulder } from "@/app/font";
import Link from "next/link";

const Hero = () => {
  return (
    <main className="container mx-auto hero min-h-screen sm:-mt-52 md:-mt-24 flex justify-center items-center">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            AI Search Engine
          </h1>
          <div className={big_shoulder.className}>
            <h1 className="text-7xl mb-2">for Research</h1>
          </div>
          <p className="text-xl mb-5">
            Find & understand the best science, faster.
          </p>

          <label className="input flex items-center gap-2 rounded-full bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Find & understand the best science, faster. "
            />
          </label>

          <div className="mt-8">
            <Link
              href={"/chat"}
              className="bg-[#5C4033] text-white rounded-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
            >
              Try for free
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
