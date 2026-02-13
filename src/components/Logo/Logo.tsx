import { Link } from "react-router-dom";
import i18n from "../../i18n";
// import DizielIcon from "../../icons/DizielIcon";
import type { LogoTypes } from "../../types/components";

const Logo = ({ theme = "light", className, noHome, variant }: LogoTypes) => {
  const currentLang = i18n.language;
  const lang: "ar" | "en" = currentLang === "ar" ? "ar" : "en";

  // const renderImage = theme === "light" ?
  //   (<DizielIcon lang={lang} className={`${variant === "logo" ? "h-[40px] !w-auto md:h-[35px] sm:!h-[30px]" : ""} ${className}`} />) : (
  //     <DizielIcon lang={lang} className={`${variant === "logo" ? "h-[40px] !w-auto md:h-[35px] sm:!h-[30px]" : ""} ${className}`} />
  //   )

  return noHome ? (
    ""
  ) : (
    <Link to="/dashboard" className="!p-0">
      <img className="w-50" src="/images/main-logo.png" alt="logo" />
    </Link>
  );
};

export default Logo;
