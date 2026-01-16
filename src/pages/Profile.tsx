import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store/store';
import { getAvatarUrl } from '../utils/avatarUtils';

const Profile = () => {
  const { t } = useTranslation("pages/profile");
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <Typography variant="h6">{t("loading_profile")}</Typography>
      </Box>
    );
  }

  return (
    <Box className="grid justify-stretch items-start gap-6 md:gap-5 sm:!gap-4">
      <Typography variant="h4" className="!font-[700]">
        {t("title")}
      </Typography>

      <Card className="!shadow-md">
        <CardContent className="!p-8">
          <Box className="flex flex-col items-center gap-6 mb-8">
            <Avatar
              src={getAvatarUrl(user.photo_url)}
              alt={user.name}
              sx={{ width: 120, height: 120 }}
              className="!border-4 !border-primary"
            />
            <Box className="text-center">
              <Typography variant="h5" className="!font-[700] !mb-2">
                {user.name}
              </Typography>
              <Typography variant="body1" className="!text-gray-600 !capitalize">
                {user.type}
              </Typography>
            </Box>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box>
              <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                {t("email")}
              </Typography>
              <Typography variant="body1" className="!font-[500]">
                {user.email}
              </Typography>
            </Box>

            {user.phone && (
              <Box>
                <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                  {t("phone")}
                </Typography>
                <Typography variant="body1" className="!font-[500]">
                  {user.phone}
                </Typography>
              </Box>
            )}

            {user.date_of_birth && (
              <Box>
                <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                  {t("date_of_birth")}
                </Typography>
                <Typography variant="body1" className="!font-[500]">
                  {new Date(user.date_of_birth).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            {user.gender && (
              <Box>
                <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                  {t("gender")}
                </Typography>
                <Typography variant="body1" className="!font-[500] !capitalize">
                  {user.gender}
                </Typography>
              </Box>
            )}

            {user.address && (
              <Box className="col-span-full">
                <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                  {t("address")}
                </Typography>
                <Typography variant="body1" className="!font-[500]">
                  {user.address}
                </Typography>
              </Box>
            )}

            {(user.city || user.state || user.postal_code || user.country) && (
              <Box className="col-span-full">
                <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                  {t("location")}
                </Typography>
                <Typography variant="body1" className="!font-[500]">
                  {[user.city, user.state, user.postal_code, user.country]
                    .filter(Boolean)
                    .join(', ')}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                {t("account_created")}
              </Typography>
              <Typography variant="body1" className="!font-[500]">
                {new Date(user.created_at).toLocaleDateString()}
              </Typography>
            </Box>

            {user.email_verified_at && (
              <Box>
                <Typography variant="subtitle2" className="!text-gray-500 !mb-1">
                  {t("email_verified")}
                </Typography>
                <Typography variant="body1" className="!font-[500] !text-green-600">
                  {t("verified")}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
