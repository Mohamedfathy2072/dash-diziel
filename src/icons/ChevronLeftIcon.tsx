import { useTranslation } from "react-i18next"

const ChevronLeftIcon = ({ className }: { className?: string }) => {
    const { i18n } = useTranslation()

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${i18n.language === "ar" ? "rotate-[180deg]" : "rotate-[0deg]"} ${className}`}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12.6723 4.41009C12.9978 4.73553 12.9978 5.26317 12.6723 5.5886L8.26158 9.99935L12.6723 14.4101C12.9978 14.7355 12.9978 15.2632 12.6723 15.5886C12.3469 15.914 11.8193 15.914 11.4938 15.5886L6.19919 10.294C6.03647 10.1313 6.03647 9.86744 6.19919 9.70472L11.4938 4.41009C11.8193 4.08466 12.3469 4.08466 12.6723 4.41009Z" fill="currentColor" />
        </svg>
    )
}

export default ChevronLeftIcon
