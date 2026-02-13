import { Box } from "@mui/material";
import { PrimaryBox } from "../../mui/boxes/PrimaryBox";
import type { SidebarTypes } from "../../types/components";

const Sidebar = ({ children }: SidebarTypes) => {

  return (
    <PrimaryBox
      className={`!w-[240px] sidebar_height bg-white fixed top-[60px] overflow-x-hidden overflow-y-auto`}
    >
      <Box
        className={`!h-fit !grid justify-stretch items-center content-start gap-5`}
      >
        {children}
      </Box>
    </PrimaryBox>
  );
};

export default Sidebar;
