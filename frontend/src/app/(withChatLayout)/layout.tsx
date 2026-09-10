import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Navbar /> */}
      <main className={`${roboto.className}`}>{children}</main>
    </>
  );
};

export default CommonLayout;
