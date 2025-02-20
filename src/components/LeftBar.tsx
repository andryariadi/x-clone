import Link from "next/link";
import Image from "./Image";
import { menuList } from "@/constant";
import Socket from "./Socket";
import Notification from "./Notification";
import UserInformation from "./UserInformation";

const LeftBar = () => {
  return (
    <aside className="b-amber-500 h-screen sticky top-0 z-50 flex flex-col justify-between pt-2 pb-2">
      {/* LOGO MENU BUTTON */}
      <div className="b-sky-500 flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818]">
          <Image path="icons/logo.svg" alt="logo" w={24} h={24} />
        </Link>

        {/* MENU LIST */}
        <nav className="flex flex-col gap-2 b-violet-500">
          {menuList.map((item, idx) => (
            <>
              {idx === 2 && (
                <div key={item.id | idx}>
                  <Notification />
                </div>
              )}

              <Link href={item.link} className="p-2 rounded-full hover:bg-[#181818] transition-all duration-300 flex items-center gap-4" key={item.id}>
                <Image path={`icons/${item.icon}`} alt={item.name} w={20} h={20} />
                <span className="hidden xxl:inline text-base">{item.name}</span>
              </Link>
            </>
          ))}
        </nav>

        {/* BUTTON */}
        <Link href="/compose/post" className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden">
          <Image path="icons/post.svg" alt="new post" w={20} h={20} />
        </Link>

        <Link href="/compose/post" className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20 text-base">
          Post
        </Link>
      </div>

      {/* USER */}
      <UserInformation />

      {/* <Socket /> */}
    </aside>
  );
};

export default LeftBar;
