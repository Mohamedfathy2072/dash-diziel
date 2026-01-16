import { useTranslation } from "react-i18next";
import { handleToaster } from "../functions/handleToaster";
import { useAppStore } from "../globals/appStore";
import logger from "../utils/logger";
import useCustomAxios from "./useCustomAxios";

const useDownloadFile = () => {
  const { server } = useCustomAxios()
  const setBackdrop = useAppStore((state) => state.setBackdrop);
  const { t } = useTranslation("hooks/use_download_file")

  const handleFetchFile = async (filePath: string) => {
    try {
      if (!filePath) {
        handleToaster({ msg: t("no_file_path_exist", { defaultValue: "لا يوجد رابط للملف" }), status: "error" })
        return
      }
      setBackdrop(true)
      await server.get(`${filePath}`, {
        responseType: "blob",
      }).then(async (res) => {
        const blob = new Blob([res.data], { type: res.headers["content-type"] });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filePath.split("/").pop() || "file.pdf";
        link.click();
        URL.revokeObjectURL(url);
      })
      setBackdrop(false)
    } catch (error) {
      logger.error("Error fetching file", error);
      handleToaster({ msg: "Error Occurs", status: "error" })
      setBackdrop(false)
    }
  }

  const handleDownloadFile = async (filePath: string) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}${filePath}`;
    if (!filePath || !url) {
      handleToaster({ msg: t("fetch_error", { defaultValue: "خطا اثناء تحميل الملف" }), status: "error" });
      return;
    }
    const opened = window.open(url, "_blank")
    if (!opened) {
      handleToaster({ msg: "Popup blocked. Please allow popups for this site.", status: "error" });
    }
  };

  const handleFetchTransactionFile = async (entry: string) => {
    try {
      if (!entry) {
        handleToaster({
          msg: t("no_file_path_exist", { defaultValue: "لا يوجد رابط للملف" }),
          status: "error",
        });
        return;
      }

      setBackdrop(true);

      const res = await server.get(`/method/print_receipt_for_payment?receipt_name=${entry}`);

      const base64Data = res.data.data.base64 || res.data.data.data_uri?.split(",")[1];

      if (!base64Data) {
        handleToaster({
          msg: t("file_not_found", { defaultValue: "الملف غير موجود" }),
          status: "error",
        });
        setBackdrop(false);
        return;
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = res.data.data.filename || "transaction_file.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      setBackdrop(false);
    } catch (error) {
      logger.error("Error fetching transaction file", error);
      handleToaster({ msg: "Error Occurs", status: "error" });
      setBackdrop(false);
    }
  };

  return { handleDownloadFile, handleFetchFile, handleFetchTransactionFile };
};

export default useDownloadFile;
