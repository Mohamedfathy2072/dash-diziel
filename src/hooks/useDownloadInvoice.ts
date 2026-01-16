import logger from "../utils/logger";

const useDownloadInvoice = () => {
  const handleDownloadInvoice = (id: string) => {
    logger.debug("Download invoice requested", { id });
    // TODO: Implement invoice download functionality
  };

  return { handleDownloadInvoice };
};

export default useDownloadInvoice;
