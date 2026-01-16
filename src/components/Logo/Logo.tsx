import { Link } from "react-router-dom";
import i18n from "../../i18n";
import JeeteakIcon from "../../icons/JeeteakIcon";
import type { LogoTypes } from "../../types/components";

const Logo = ({ theme = "light", className, noHome, variant }: LogoTypes) => {
  const currentLang = i18n.language;
  const lang: "ar" | "en" = currentLang === "ar" ? "ar" : "en";

  const renderImage = theme === "light" ?
    (<JeeteakIcon lang={lang} className={`${variant === "logo" ? "h-[40px] !w-auto md:h-[35px] sm:!h-[30px]" : ""} ${className}`} />) : (
      <JeeteakIcon lang={lang} className={`${variant === "logo" ? "h-[40px] !w-auto md:h-[35px] sm:!h-[30px]" : ""} ${className}`} />
    )

  return noHome ? renderImage : (
    <Link to={`/dashboard`} className={`!p-0`}>
      {renderImage}
    </Link>
  );
};

export default Logo;
