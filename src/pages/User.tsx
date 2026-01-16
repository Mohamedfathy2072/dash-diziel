import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MailIcon from "../icons/MailIcon";
import PhoneIcon from "../icons/PhoneIcon";
import LocationIcon from "../icons/LocationIcon";
import CheckCircleIcon from "../icons/CheckCircleIcon";
import PageHeader from "../components/common/PageHeader/PageHeader";
import InfoCard from "../components/common/InfoCard/InfoCard";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import ProfileHeader from "../components/common/ProfileHeader/ProfileHeader";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import useDetailPage from "../hooks/useDetailPage";
import { fetchUserById, clearSelectedUser } from "../store/usersSlice";
import { fetchUserRatings } from "../store/ratingsSlice";
import RatingList from "../components/ratings/RatingList";
import RatingStars from "../components/ratings/RatingStars";
import { getAvatarUrl } from "../utils/avatarUtils";
import { getUserTypeColor } from "../utils/userUtils";
import type { RootState, AppDispatch } from "../store/store";

const User = () => {
  const { t } = useTranslation("pages/user");
  const dispatch = useDispatch<AppDispatch>();

  const { id, selectedItem: selectedUser, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.users.selectedUser,
      loading: state.users.loading,
      error: state.users.error,
    }),
    fetchAction: fetchUserById,
    clearAction: clearSelectedUser,
    backRoute: `${import.meta.env.VITE_USERS_ROUTE}`,
  });

  const userRatings = useSelector((state: RootState) => state.ratings.userRatings) || [];
  const ratingsLoading = useSelector((state: RootState) => state.ratings.loading);

  // Fetch user ratings when user is loaded
  useEffect(() => {
    if (selectedUser?.id) {
      dispatch(fetchUserRatings(selectedUser.id));
    }
  }, [selectedUser?.id, dispatch]);

  const photoUrl = getAvatarUrl(selectedUser?.photo_url);

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_USERS_ROUTE}/edit/${id}`}
      deleteType="deleteUser"
      deleteIdKey="userId"
      editLabel={t("edit", { defaultValue: "Edit" })}
      deleteLabel={t("delete", { defaultValue: "Delete" })}
    />
  );

  return (
    <DetailPageWrapper
      loading={loading}
      error={error}
      data={selectedUser}
      notFoundMessage={t("user_not_found", { defaultValue: "User not found" })}
      onBack={handleBack}
      backLabel={t("back_to_users", { defaultValue: "Back to Users" })}
    >
      <PageHeader
        title={t("user_details", { defaultValue: "User Details" })}
        backUrl={`${import.meta.env.VITE_USERS_ROUTE}`}
        actions={actions}
      />

      {/* User Profile Card */}
      <Paper className="paper !overflow-hidden">
        <ProfileHeader
          photoUrl={photoUrl}
          name={selectedUser?.name || ""}
          subtitle={
            selectedUser?.email_verified_at ? (
              <Box className="flex items-center justify-center md:justify-start gap-1.5 bg-white/20 px-3 py-1.5 rounded-full w-fit mx-auto md:mx-0 mt-2">
                <CheckCircleIcon className="w-4 h-4 !text-white" />
                <Typography variant="caption" className="!text-white !font-[500]">
                  {t("email_verified", { defaultValue: "Email Verified" })}
                </Typography>
              </Box>
            ) : undefined
          }
          status={selectedUser?.type}
          statusLabel={selectedUser?.type}
          statusColor={selectedUser ? getUserTypeColor(selectedUser.type) : ""}
          variant="gradient"
          avatarSize={120}
          // actions={actions}
        />

        {/* Content Section */}
        {selectedUser && (
        <Box className="p-8 -mt-6">

            {/* Contact Information Section */}
            <Box className="mb-8">
              <SectionHeader
                icon={<MailIcon className="w-5 h-5 !text-[#003366]" />}
                title={t("contact_information", { defaultValue: "Contact Information" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoCard
                  icon={<MailIcon className="w-5 h-5 !text-[#003366]" />}
                  label={t("email", { defaultValue: "Email" })}
                  value={selectedUser.email}
                />
                <InfoCard
                  icon={<PhoneIcon className="w-5 h-5 !text-[#003366]" />}
                  label={t("phone", { defaultValue: "Phone" })}
                  value={selectedUser.phone}
                />
              </Box>
            </Box>

            {/* Personal Information Section */}
            {(selectedUser.date_of_birth || selectedUser.gender) && (
              <Box className="mb-8">
                <SectionHeader
                  title={t("personal_information", { defaultValue: "Personal Information" })}
                  className="mb-4"
                />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <InfoField
                    label={t("date_of_birth", { defaultValue: "Date of Birth" })}
                    value={(selectedUser as any).date_of_birth ? new Date((selectedUser as any).date_of_birth).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : null}
                  />
                  <InfoField
                    label={t("gender", { defaultValue: "Gender" })}
                    value={selectedUser.gender ? selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1) : null}
                  />
                </Box>
              </Box>
            )}

            {/* Address Information Section */}
            {(selectedUser.address || selectedUser.city || selectedUser.state || selectedUser.postal_code || selectedUser.country) && (
              <Box className="mb-8">
                <SectionHeader
                  icon={<LocationIcon className="w-5 h-5 !text-[#003366]" />}
                  title={t("address_information", { defaultValue: "Address Information" })}
                  className="mb-4"
                />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <InfoCard
                    icon={<LocationIcon className="w-5 h-5 !text-[#003366]" />}
                    label={t("address", { defaultValue: "Address" })}
                    value={selectedUser.address}
                    className="col-span-full"
                  />
                  <InfoField
                    label={t("city", { defaultValue: "City" })}
                    value={selectedUser.city}
                  />
                  <InfoField
                    label={t("state", { defaultValue: "State" })}
                    value={selectedUser.state}
                  />
                  <InfoField
                    label={t("postal_code", { defaultValue: "Postal Code" })}
                    value={selectedUser.postal_code}
                  />
                  <InfoField
                    label={t("country", { defaultValue: "Country" })}
                    value={selectedUser.country}
                  />
                </Box>
              </Box>
            )}

            <Divider className="!my-8" />

            {/* Ratings Section */}
            {selectedUser.rating != null && (
              <>
                <SectionHeader
                  title={t("ratings", { defaultValue: "Ratings & Reviews" })}
                  icon={<CheckCircleIcon className="w-5 h-5 text-[#003366]" />}
                />
                <Box className="mb-4">
                  <Box className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <Box>
                      <Typography variant="caption" className="text-gray-600 block mb-1">
                        {t("overallRating", { defaultValue: "Overall Rating" })}
                      </Typography>
                      <Box className="flex items-center gap-2">
                        <RatingStars rating={typeof selectedUser.rating === 'number' ? selectedUser.rating : Number(selectedUser.rating)} showValue />
                        <Typography variant="body2" className="text-gray-600">
                          ({userRatings.length} {t("reviews", { defaultValue: "reviews" })})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {ratingsLoading ? (
                  <Typography variant="body2" className="text-gray-500 text-center py-8">
                    {t("loadingRatings", { defaultValue: "Loading ratings..." })}
                  </Typography>
                ) : (
                  <RatingList
                    ratings={Array.isArray(userRatings) ? userRatings.slice(0, 5) : []}
                    showDetails={true}
                    emptyMessage={t("noRatingsYet", { defaultValue: "No ratings yet" })}
                  />
                )}
                <Divider className="!my-8" />
              </>
            )}

            {/* Account Information Section */}
            <Box>
              <SectionHeader
                title={t("account_information", { defaultValue: "Account Information" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoField
                  label={t("created_at", { defaultValue: "Created At" })}
                  value={new Date(selectedUser.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                />
                <InfoField
                  label={t("updated_at", { defaultValue: "Updated At" })}
                  value={new Date(selectedUser.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                />
              </Box>
            </Box>
            </Box>
        )}
      </Paper>
    </DetailPageWrapper>
  );
};

export default User;

