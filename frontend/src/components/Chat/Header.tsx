import Link from "next/link";

const Header: React.FC = () => {
  // const isUser = isLoggedIn();
  // const router = useRouter();
  // const handleRedirect = (e: any) => {
  //   e.preventDefault();
  //   if (!!isUser) {
  //     router.push("/");
  //   }
  // };

  return (
    <div className="dark:bg-secondary bg-white border border-secondary p-3 rounded-3xl font-bold">
      <div className="flex justify-center items-center gap-10">
        <Link
          href={"#"}
          className="hover:bg-primary py-1 px-4 rounded-3xl dark:text-white hover:text-black"
        >
          Home
        </Link>
        <Link
          href={"#"}
          className="hover:bg-primary py-1 px-4 rounded-3xl dark:text-white hover:text-black"
        >
          About Us
        </Link>
        <Link
          href={"/plans"}
          className="hover:bg-primary py-1 px-4 rounded-3xl dark:text-white hover:text-black"
        >
          Plans
        </Link>
        <Link
          href={"#"}
          className="hover:bg-primary py-1 px-4 rounded-3xl dark:text-white hover:text-black"
        >
          Privacy Policy
        </Link>
        <Link
          href={"#"}
          className="hover:bg-primary py-2 px-4 rounded-3xl dark:text-white hover:text-black"
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default Header;
