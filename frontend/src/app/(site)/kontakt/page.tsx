import Contact from "@/components/Contact";
import { Metadata } from "next";
// import Contact from "@/components/contact";

export const metadata: Metadata = {
  title: "Support Page",
  description: "This is Support page for German Law AI",
  // other metadata
};

const SupportPage = () => {
  return (
    <div className="pt-56 pb-32">
      <Contact />
    </div>
  );
};

export default SupportPage;
