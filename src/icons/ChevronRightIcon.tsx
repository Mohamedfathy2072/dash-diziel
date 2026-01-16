import { useTranslation } from "react-i18next"

const ChevronRightIcon = ({ className }: { className?: string }) => {
    const { i18n } = useTranslation()

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${i18n.language === "ar" ? "rotate-[180deg]" : "rotate-[0deg]"} ${className}`}>
            <path fillRule="evenodd" clipRule="evenodd" d="M7.32709 4.41009C7.00165 4.73553 7.00165 5.26317 7.32709 5.5886L11.7378 9.99935L7.32709 14.4101C7.00165 14.7355 7.00165 15.2632 7.32709 15.5886C7.65252 15.914 8.18016 15.914 8.5056 15.5886L13.8002 10.294C13.9629 10.1313 13.9629 9.86744 13.8002 9.70472L8.5056 4.41009C8.18016 4.08466 7.65252 4.08466 7.32709 4.41009Z" fill="currentColor" />
        </svg>
    )
}

export default ChevronRightIcon
