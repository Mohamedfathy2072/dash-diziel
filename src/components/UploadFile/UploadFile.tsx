import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormsStore } from "../../globals/formsStore";
import DeleteIcon from "../../icons/DeleteIcon";
import PhotoIcon from "../../icons/PhotoIcon";
import UploadIcon from "../../icons/UploadIcon";
import { ErrorButton } from '../../mui/buttons/ErrorButton';
import { GradientButton } from '../../mui/buttons/GradientButton';
import type { UploadFilesTypes } from "../../types/components";
import SubmitButton from '../SubmitButton/SubmitButton';
import TableIconButton from "../TableIconButton/TableIconButton";

const UploadFile = ({ handle }: UploadFilesTypes) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isLoading = useFormsStore((state) => state.isLoading);
  const { t } = useTranslation("components/upload_file");

  const handleView = () => {
    if (!file) return;
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  }

  const handleUploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFiles = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box className="grid justify-stretch items-center gap-3">
      <Typography variant="h6" className="!font-[700]">
        {t("uploadFileTitle")}
      </Typography>
      <Box
        className={`bg-white rounded-xl p-4 grid justify-stretch items-center text-center gap-4 ${file ? "" : "border-[1px] border-dashed border-primary"
          }`}
      >
        <label htmlFor="files" className="!hidden">
          .
        </label>
        <input
          id="files"
          type="file"
          name="files"
          placeholder="files"
          ref={fileInputRef}
          onChange={handleUploadFiles}
          className="absolute z-[10] opacity-0"
          accept=".jpg,.jpeg,.png,.svg,.gif,.webp,.pdf"
        />
        {file && (
          <Box className="flex justify-end items-center">
            <TableIconButton
              onClick={handleRemoveFiles}
              className="!bg-error_100 !text-error_dark w-fit"
            >
              <DeleteIcon />
            </TableIconButton>
          </Box>
        )}
        {file ? (
          <button type={"button"} onClick={handleView} className="flex justify-center items-center gap-2 py-4 group">
            <PhotoIcon className="text-3xl group-hover:text-primary" />
            <Typography variant="subtitle1" className="!text-neutral_300 group-hover:!text-primary group-hover:!font-[700]">
              {t("transferImage")}
            </Typography>
          </button>
        ) : (
          <>
            <Box
              className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-primary_200 m-auto relative border-[4px] border-solid border-primary_100"
            >
              <UploadIcon />
            </Box>
            <Typography variant="subtitle1" className="!text-neutral_300">
              {t("addFileHint")}
            </Typography>
          </>
        )}
        <Box className="flex justify-center items-center gap-4">
          {file ? (
            <>
              <SubmitButton
                variant="gradient"
                type="button"
                loading={isLoading}
                handling={async () => {
                  const success = await handle(file);
                  if (success) {
                    handleRemoveFiles();
                  }
                }}
              >
                {t("saveAndSend")}
              </SubmitButton>
              <ErrorButton onClick={handleRemoveFiles}>{t("cancel")}</ErrorButton>
            </>
          ) : (
            <GradientButton onClick={handleClickUpload}>
              {t("addFromHere")}
            </GradientButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadFile;
