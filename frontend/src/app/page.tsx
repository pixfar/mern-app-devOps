"use client";
import Header from "@/components/Header/Header";
import HomeMain from "@/components/Hero/HeroV2";
import Footer from "@/components/Shared/Footer/Footer";
import { isLoggedIn } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isUser = isLoggedIn();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isMdScreen, setIsMdScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      const mdScreenSize = 768;
      setIsMdScreen(window.innerWidth >= mdScreenSize);
    };
    checkScreenSize();
    const handleResize = () => {
      checkScreenSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Header />
      <HomeMain />
      <div className="bottom-0 w-full z-50">{<Footer />}</div>
    </>
  );
};

export default Home;
