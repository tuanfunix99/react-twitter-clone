import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline";
import SidebarLink from "./SidebarLink";
import { User } from "../base";
import { useState } from "react";
import LogoutModal from "./modal/auth/Logout";
import { Tooltip } from "flowbite-react";
import TwitterIcon from "./TwitterIcon";
import Avatar from "./custom/avatar/";
import UserProfileModal from "./modal/userprofile";

interface SidebarProps {
  user: User | null;
}

function Sidebar({ user }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="sm:flex flex-col border-r border-gray-700 sm:items-start sm:w-[200px] p-2 h-screen sticky top-0">
      <LogoutModal open={open} setOpen={(value: boolean) => setOpen(value)} />
      <UserProfileModal
        open={openProfile}
        setOpen={(value: boolean) => setOpenProfile(value)}
        user={user}
      />
      <div className="flex items-center justify-center p-0 w-14 h-14 hoverAnimation sm:ml-24">
        <TwitterIcon width={30} height={30} />
      </div>
      <div className="space-y-1 mt-4 mb-2.5 sm:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} active />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink
          text="Profile"
          Icon={UserIcon}
          onClick={() => setOpenProfile(true)}
        />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>

      <div
        className="text-[#d9d9d9] flex items-center cursor-pointer mt-12 ml-2 sm:ml-20 xl:px-4"
        onClick={() => setOpen(true)}
      >
        <Tooltip placement="top" content={user?.displayName}>
          <Avatar photoURL={user?.photoURL} size="sm" />
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;
