import { useNavigate } from "react-router-dom";
import { Tooltip } from "flowbite-react";

interface SidebarLinkProps {
  Icon: any;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({ Icon, text, active, onClick }: SidebarLinkProps) {
  return (
    <Tooltip content={text} placement="right">
      <div
        className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
          active && "font-bold"
        }`}
        onClick={onClick}
      >
        <Icon className="h-7" />
        {/* <span className="hidden xl:inline">{text}</span> */}
      </div>
    </Tooltip>
  );
}

export default SidebarLink;
