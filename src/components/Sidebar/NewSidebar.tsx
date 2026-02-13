import { Box, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PrimaryBox } from "../../mui/boxes/PrimaryBox";
import type { NewSidebarTypes } from "../../types/components";
import Item from "./Item";

const NewSidebar = ({
  items,
  logoutItem,
  open,
  handleToggleSidebar,
}: NewSidebarTypes) => {
  const { i18n } = useTranslation();

  return (
    <nav className="sidebar">
      {items.map(
        ({ key, icon, title, link, visible, onClick }, i) =>
          visible && (
            <Item
              key={key}
              icon={icon}
              title={title}
              index={i}
              link={link}
              onClick={() => {
                if (onClick) {
                  onClick();
                }
                if (handleToggleSidebar) {
                  handleToggleSidebar();
                }
              }}
            />
          ),
      )}
    </nav>
  );
};
export default NewSidebar;
