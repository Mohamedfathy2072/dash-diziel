import { AppBar, Avatar, Box, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLang from "../../hooks/useLang";
import LanguageIcon from "../../icons/LanguageIcon";
import MenuIcon from "../../icons/MenuIcon";
import NotificationIcon from "../../icons/NotificationIcon";
import { PrimaryContainer } from "../../mui/containers/PrimaryContainer";
import type { HeaderTypes } from "../../types/components";
import Logo from "../Logo/Logo";
import {
  BrushCleaning,
  Globe,
  LanguagesIcon,
  LogOut,
  Maximize,
  Minimize,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Header = ({
  avatar,
  variant,
  handleNotification,
  handleNotifications,
  openNotifications,
  noShadow,
  noHome,
  noNotifications,
  handleToggleSidebar,
}) => {
  const { t } = useTranslation("pages/header");
  const { user } = useSelector((state) => state.auth);
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <nav className="navbar navbar-expand">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <div className="logo-icon"><Logo/></div>
        </a>

        <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-1">
          <button
            className="btn btn-outline navbar-button"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </button>

          <button
            className="btn btn-outline navbar-button"
            type="button"
            onClick={handleChangeLang}
          >
            <Globe />
          </button>

          <div className="dropdown">
            <button
              className="btn text-decoration-none dropdown-toggle d-flex align-items-center gap-2 user-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
              }}
            >
              <img src={avatar} alt="User Avatar" className="user-avatar" />
              <span className="user-name">{user?.name}</span>
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? "show" : ""}`}
            >
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center gap-2"
                  to={import.meta.env.VITE_PROFILE_ROUTE}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User />
                  {t("myProfile", { defaultValue: "My Profile" })}
                </Link>
              </li>
             
              <li>
                <a
                  className="dropdown-item d-flex align-items-center gap-2 text-danger"
                  href="#"
                >
                  <LogOut />
                  {t("logOut", { defaultValue: "Log out" })}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
