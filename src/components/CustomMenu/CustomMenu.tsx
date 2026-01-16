import { Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import useQueries from "../../hooks/useQueries";
import MenuIcon from "../../icons/MenuIcon";
import type { CustomMenuTypes } from "../../types/components";

const CustomMenu = ({ children, button, limit, className }: CustomMenuTypes) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { handleGetQueries } = useQueries()
  const queries = handleGetQueries()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        id="long-button"
        aria-label="more"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "long-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className={`!p-0 ${((!limit && Object.keys(queries).length > 2) || (limit && queries['limit'] && queries['limit'] !== '10')) && "[&_button]:!bg-primary [&_button]:!text-white"}`}
      >
        {button || <MenuIcon className="rotate-[90deg]" />}
      </Box>
      <Menu
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className={`custom_menu ${className}`}
      >
        {children}
      </Menu>
    </>
  );
};

export default CustomMenu;
