import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";
import Footer from "../components/Footer/Footer";
import Header from '../components/Header/Header';
import { getAvatarUrl } from "../utils/avatarUtils";
import { useAppStore } from "../globals/appStore";
import useAuth from "../hooks/useAuth";
import Modals from "../Modals";
import { PrimaryBox } from '../mui/boxes/PrimaryBox';
import { PrimaryContainer } from '../mui/containers/PrimaryContainer';
import BreadCrumbSection from "../sections/BreadCrumbSection/BreadCrumbSection";
import type { RootState } from "../store/store";

const SecureRoute = ({ children }: { children: React.ReactNode }) => {
    const { handleGetAuthorization } = useAuth();
    const { user } = useSelector((state: RootState) => state.auth);
    const { i18n } = useTranslation();
    const sidebar = useAppStore((state) => state.sidebar);
    const setSidebar = useAppStore((state) => state.setSidebar);
    const lang =
        localStorage.getItem(`${import.meta.env.VITE_TOKEN_LANG_STORAGE}`) || i18n.language;

    const isAuth = handleGetAuthorization();

    if (!isAuth) return <Navigate to={import.meta.env.VITE_LOGIN_ROUTE} replace />;

    return (
        <Box component="main">
            <Header
                avatar={getAvatarUrl(user?.photo_url)}
                variant="superAdmin"
                handleToggleSidebar={() => setSidebar(!sidebar)}
            />
            <Box className="pt-[60px] md:pt-[55px] sm:!pt-[50px] grid justify-stretch items-center !h-full">
                <DashboardSidebar />
                <Box
                    className={`grid justify-stretch items-stretch self-stretch !content-between ${lang === "ar" ? "pr-[260px] lg:!pr-[0px]" : "pl-[260px] lg:!pl-[0px]"
                        }`}
                >
                    <PrimaryBox>
                        <PrimaryContainer className="!grid justify-stretch items-start gap-6 md:gap-5 sm:!gap-4">
                            <BreadCrumbSection />
                            {children}
                        </PrimaryContainer>
                    </PrimaryBox>
                    <Footer />
                </Box>
            </Box>
            <Modals />
        </Box>
    );
};

export default SecureRoute;
