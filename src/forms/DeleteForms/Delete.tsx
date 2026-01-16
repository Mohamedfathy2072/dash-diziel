import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { useFormsStore } from "../../globals/formsStore";
import { useModalsStore } from "../../globals/modalsStore";
import DeleteIcon from "../../icons/DeleteIcon";
import { BasicButton } from '../../mui/buttons/BasicButton';
import type { DeleteTypes } from "../../types/forms";

const Delete = ({ title, description }: DeleteTypes) => {
  const setDeleteModal = useModalsStore((state) => state.setDeleteModal);
  const isLoading = useFormsStore((state) => state.isLoading);
  const { t } = useTranslation("forms/delete_form");

  return (
    <Box className="grid justify-stretch items-center gap-5">
      <Box className="m-auto w-[100px] h-[100px] rounded-full bg-error_100 flex justify-center items-center">
        <DeleteIcon className="!text-error_dark w-[50px] h-[50px] lg:w-[45px] lg:h-[45px] md:w-[40px] md:h-[40px] sm:w-[35px] sm:h-[35px] xs:w-[30px] xs:h-[30px]" />
      </Box>

      <Box className="grid justify-stretch items-center gap-2 text-center">
        {title && (
          <Typography variant="h5" className="!font-[700]">
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="subtitle1">{description}</Typography>
        )}
      </Box>

      <Box className="flex justify-center items-center gap-3 flex-wrap">
        <SubmitButton variant="error" loading={isLoading}>
          {t("delete", { defaultValue: "حذف" })}
        </SubmitButton>
        <BasicButton onClick={() => setDeleteModal(false)}>
          {t("cancel", { defaultValue: "إلغاء" })}
        </BasicButton>
      </Box>
    </Box>
  );
};

export default Delete;
