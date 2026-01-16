import { AppBar, Avatar, Box, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLang from "../../hooks/useLang";
import LanguageIcon from "../../icons/LanguageIcon";
import MenuIcon from "../../icons/MenuIcon";
import NotificationIcon from "../../icons/NotificationIcon";
import { PrimaryContainer } from "../../mui/containers/PrimaryContainer";
import type { HeaderTypes } from "../../types/components";
import Logo from "../Logo/Logo";

const Header = ({ avatar, variant, handleNotification, handleNotifications, openNotifications, noShadow, noHome, noNotifications, handleToggleSidebar }: HeaderTypes) => {
  const [scrolled, setScrolled] = useState(false);
  const { handleChangeLang, handleSetLang } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window != "undefined") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      });
    }
    handleSetLang();
  }, []);

  return (
    <AppBar className={`h-[60px] md:h-[55px] sm:!h-[50px] ${(!scrolled || noShadow) && "!shadow-none"}`}>
      <PrimaryContainer className="!flex justify-between items-center gap-8 py-3 md:gap-6 sm:!gap-4 md:py-2 sm:!py-1">
        <Box className={`flex justify-center items-center gap-3 md:gap-2 sm:!gap-1`}>
          <IconButton className={`!hidden lg:!flex !text-white`} onClick={handleToggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Logo variant="logo" noHome={noHome} />
        </Box>
        <Box className={`flex justify-end items-center gap-6 md:gap-4 sm:!gap-2`}>
          <IconButton
            onClick={handleChangeLang}
            className={`!bg-[rgba(255,255,255,0.5)] group !rounded-md w-[37.5px] h-[37.5px] flex justify-center items-center`}
          >
            <LanguageIcon
              className={`text-white subtitle1 group-hover:text-primary group-hover:subtitle2`}
            />
          </IconButton>
          {(variant !== "superAdmin" && variant !== "sales" && !noNotifications) &&
            <>
              <Divider orientation="vertical" className={`!border-gray-300 h-3/4`} />
              <IconButton
                onClick={handleNotification || handleNotifications}
                id="basic-button"
                aria-controls={openNotifications ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openNotifications ? 'true' : undefined}
                className={`!bg-[rgba(255,255,255,0.5)] group !rounded-md w-[37.5px] h-[37.5px] flex justify-center items-center`}
              >
                <NotificationIcon
                  className={`text-white subtitle1 group-hover:text-primary group-hover:subtitle2`}
                />
              </IconButton>
            </>
          }
          {(variant !== "reviewer" && variant !== "sales") &&
            <>
              <Divider orientation="vertical" className={`!border-gray-300 h-3/4`} />
              <IconButton
                onClick={() => navigate(`${import.meta.env.VITE_PROFILE_ROUTE}`)}
                className={`transition-all hover:scale-[0.9] !shadow-sm`}
              >
                <Avatar src={avatar} />
              </IconButton>
            </>}
        </Box>
      </PrimaryContainer>
    </AppBar>
  );
};

export default Header;
