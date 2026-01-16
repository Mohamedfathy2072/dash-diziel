import { Box, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PrimaryBox } from "../../mui/boxes/PrimaryBox";
import type { NewSidebarTypes } from "../../types/components";
import Item from "./Item";

const NewSidebar = ({ items, logoutItem, open, handleToggleSidebar }: NewSidebarTypes) => {
    const { i18n } = useTranslation()

    return (
        <>
            <PrimaryBox
                className={`!w-[260px] lg:w-[25vw] md:!w-1/2 transition-all sidebar_height bg-white fixed top-[60px] md:top-[55px] sm:!top-[50px] overflow-x-hidden overflow-y-auto lg:!z-[100] ${open ? "lg:translate-x-[0px]" : i18n.language === "en" ? "lg:translate-x-[-100%]" : "lg:translate-x-[100%]"}`}
            >
                <Box
                    className={`!h-fit !grid justify-stretch items-center content-start gap-5`}
                >
                    {items.map(({ key, icon, title, link, visible, onClick }, i) => visible && (
                        <Item key={key} icon={icon} title={title} index={i} link={link} onClick={() => {
                            if (onClick) {
                                onClick()
                            }
                            if (handleToggleSidebar) {
                                handleToggleSidebar()
                            }
                        }} />
                    ))}
                    <Divider />
                    <Item key={logoutItem.key} icon={logoutItem.icon} title={logoutItem.title} logout onLogout={logoutItem.handle} />
                </Box>
            </PrimaryBox>
            {
                open && <Box onClick={handleToggleSidebar} className={`bg-[rgba(0,0,0,0.5)] w-screen h-screen z-[1] fixed left-0 top-0 hidden lg:!flex`} />
            }
        </>
    );
};

export default NewSidebar;
