import { useParams } from "react-router-dom"

const useAppRoutes = () => {
    const { id } = useParams()

    const authRoutes = [
        `${import.meta.env.VITE_LOGIN_ROUTE}`,
        `${import.meta.env.VITE_UPDATE_PASSWORD_ROUTE}`
    ]

    const tourNotWorkRoutes = [
        `${import.meta.env.VITE_LOGIN_ROUTE}`,
        `${import.meta.env.VITE_UPDATE_PASSWORD_ROUTE}`,
        `${import.meta.env.VITE_PACKAGES_ROUTE}/edit/${id}`
    ]

    return { authRoutes, tourNotWorkRoutes }
}

export default useAppRoutes;
