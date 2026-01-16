import { handleToaster } from "./handleToaster";
import logger from "../utils/logger";

export const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        logger.debug("Text copied to clipboard", { text });
        handleToaster({ msg: `Text copied to clipboard: ${text}`, status: "success", pos: "bottom-center" });
    }).catch((err) => {
        logger.error("Failed to copy text", err);
        handleToaster({ msg: `Failed to copy text: ${err}`, status: "error", pos: "bottom-center" });
    });
};