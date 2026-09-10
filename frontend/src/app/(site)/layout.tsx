"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Shared/Footer/Footer";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default SiteLayout;
