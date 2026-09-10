import { big_shoulder } from "@/app/font";
import { Exo_2 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Typewriter from "typewriter-effect";
export const exo = Exo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-DMSans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// new Typewriter("#typewriter", {
//   strings: ["Hello", "World"],
//   autoStart: true,
// });

const HomeMain = () => {
  return (
    <div className="pt-1 md:pt-0 text-black dark:text-black bg-cover bg-center sm:bg-top px-4 md:px-6">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row gap-[10%] h-[calc(100vh-81px)]">
        {/* Text Section */}
        <div className="  md:flex md:w-[70%] items-center justify-start lg:order-2 order-1 mb-0 lg:mb-0">
          <div className=" md:max-w-[500px]">
            <div className="dark:text-white "></div>
            <h1 className="text-xl text-center md:text-start sm:text-4xl md:text-5xl font-bold mb-2 leading-tight">
              Dein KI-Assistent
            </h1>
            <div className={`${big_shoulder.className}`}>
              <h1 className="text-3xl text-center md:text-start sm:text-3xl md:text-5xl mb-4 leading-tight dark:text-white/50 ">
                fürs Jura-Studium
              </h1>
            </div>
            <div className="text-sm text-center md:hidden md:text-sm mb-2 leading-relaxed">
              <Typewriter
                options={{
                  strings: [
                    "Einfaches Matching Deiner Scripten mit",
                    "den passenden Gesetzestexten.",
                    "pdf-Download der Zusammenfassungen.",
                    "Füge eigene Mitschriften ein.",
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                }}
              />
            </div>
            <div className="md:text-2xl hidden md:block font-bold dark:text-white">
              <Typewriter
                options={{
                  strings: [
                    "Einfaches Matching Deiner Scripten mit den passenden Gesetzestexten.",
                    "pdf-Download der Zusammenfassungen.",
                    "Füge eigene Mitschriften ein.",
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                }}
              />
            </div>

            <div className="text-center md:text-start mt-5 mb-8 lg:mb-0">
              <Link
                href={"/chat"}
                className="bg-[#5C4033] text-white rounded-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
              >
                Anmelden
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center order-1 items-center w-full  mt-6 lg:mt-0">
          <div className="relative w-full h-full aspect-[11/10] max-w-[880px]">
            <Image
              src="/germanlaw.png"
              alt="German Law"
              layout="fill"
              objectFit="contain"
              className=""
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
