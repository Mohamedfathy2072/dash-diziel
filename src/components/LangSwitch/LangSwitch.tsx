import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useLang from "../../hooks/useLang";
import LanguageIcon from "../../icons/LanguageIcon";
import { PrimaryButton } from "../../mui/buttons/PrimaryButton";

const LangSwitch = () => {
  const { t, i18n } = useTranslation("components/lang_switch");
  const { handleSetLang, handleChangeLang } = useLang();
  const lang = i18n.language;

  useEffect(() => {
    handleSetLang();
  }, []);

  return (
    <PrimaryButton
      onClick={handleChangeLang}
      className={`w-fit !absolute !top-[30px] ${lang === "ar" ? "!left-[40px]" : "!right-[40px] flex justify-center items-center gap-3"
        }`}
    >
      <LanguageIcon className={`w-[18px] h-auto`} />
      {t("lang")}
    </PrimaryButton>
  );
};

export default LangSwitch;
