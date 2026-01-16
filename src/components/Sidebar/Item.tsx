import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { handleLogout } from "../../functions/handleLogout";
import { PrimaryContainer } from "../../mui/containers/PrimaryContainer";
import type { SidebarItemTypes } from "../../types/components";

const Item = ({ icon, title, link, logout, index, onLogout, onClick }: SidebarItemTypes) => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation()
  const navigate = useNavigate();
  let active = false;
  if (
    (link &&
      pathname.split("/").length > 1 &&
      link.split("/").length > 1 &&
      pathname.split("/")[1] === link.split("/")[1]) ||
    pathname === link
  ) {
    active = true;
  }

  const content = (
    <>
      <Box
        className={`absolute ${i18n.language === "ar" ? "right-0" : "left-0"} top-0 h-full w-[6px] ${logout ? "bg-red-600" : "bg-primary"
          } hidden group-hover:flex ${active && "!flex"}`}
      />
      <PrimaryContainer
        id={`sidebar_item_${index}`}
        className={`!flex justify-stretch items-start gap-3 py-2 transition-all [&>svg]:text-[20px] ${logout
          ? "[&>svg]:hover:text-red-600  hover:bg-red-200"
          : "[&>svg]:hover:text-primary  hover:bg-primary_100"
          } ${active &&
          `${logout
            ? "[&>svg]:text-red-600 bg-red-200"
            : "[&>svg]:text-primary bg-primary_100"
          }`
          }`}
      >
        {icon}
        <Typography
          variant="subtitle2"
          className={`transition-all flex flex-wrap justify-start items-center gap-1 ${logout ? "group-hover:text-red-600" : "group-hover:text-primary"
            } ${active && `${logout ? "text-red-600" : "text-primary"} !font-[700]`
            }`}
        >
          {title}
        </Typography>
      </PrimaryContainer>
    </>
  );

  const handleLogOut = () => {
    handleLogout();
    if (onLogout) {
      onLogout()
    }
    navigate(`${import.meta.env.VITE_LOGIN_ROUTE}`);
  };

  return logout ? (
    <button onClick={handleLogOut} className={`relative group`}>
      {content}
    </button>
  ) : (
    <div onClick={() => {
      navigate(`${link}`)
      if (onClick) {
        onClick()
      }
    }} className={`relative group !cursor-pointer`}>
      {content}
    </div>
  );
};

export default Item;
