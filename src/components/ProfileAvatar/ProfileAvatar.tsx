import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { useModalsStore } from "../../globals/modalsStore";
import PhotoIcon from "../../icons/PhotoIcon";
import type { RootState } from "../../store/store";
import ImageBox from '../ImageBox/ImageBox';

const ProfileAvatar = () => {
  const setChangeProfileAvatarModal = useModalsStore((state) => state.setChangeProfileAvatarModal);
  const { i18n } = useTranslation()
  const { profile } = useSelector((state: RootState) => state.profile)

  return (
    <Box
      className={`relative w-[200px] h-[200px] m-auto rounded-full bg-gray-300`}
    >
      <ImageBox src={getAvatarUrl(profile?.photo_url)} className="w-full h-full rounded-full" />
      <IconButton
        onClick={() =>
          setChangeProfileAvatarModal(true)
        }
        className={`!rounded-full !bg-primary !text-white p-2 !border-[1px] !border-solid !border-primary transition-all hover:!bg-white hover:!text-primary !absolute bottom-[10px] ${i18n.language === "en" ? "left-[20px]" : "right-[20px]"} w-[40px] !h-[40px]`}
      >
        <PhotoIcon />
      </IconButton>
    </Box>
  );
};

export default ProfileAvatar;
