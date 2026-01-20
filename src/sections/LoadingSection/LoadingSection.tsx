import LoadingIcon from "../../icons/LoadingIcon";
import DizielIcon from "../../icons/DizielIcon";

const LoadingSection = () => {
    const lang = localStorage.getItem(`${import.meta.env.VITE_TOKEN_LANG_STORAGE}`) as "ar" | "en"

    return (
        <div
            className={`grid justify-center items-center content-center bg-primary gap-6 min-h-screen min-w-screen`}
        >
            <JeeteakIcon lang={lang} className={`w-auto h-[75px] lg:h-[60px] md:h-[50px] sm:h-[40px]`} />
            <div className="flex justify-center items-center">
                <LoadingIcon className="animate-spin text-white w-[40px] h-[40px]" />
            </div>
        </div>
    )
}

export default LoadingSection;
