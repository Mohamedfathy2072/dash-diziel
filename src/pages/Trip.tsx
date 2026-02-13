import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import TripMap from "../components/common/TripMap/TripMap";
import TripTrackingTree from "../components/common/TripTrackingTree/TripTrackingTree";
import LocationCard from "../components/trip/LocationCard/LocationCard";
import UserInfoCard from "../components/trip/UserInfoCard/UserInfoCard";
import VehicleInfoCard from "../components/trip/VehicleInfoCard/VehicleInfoCard";
import TripOfferCard from "../components/trip/TripOfferCard/TripOfferCard";
import TimelineItem from "../components/trip/TimelineItem/TimelineItem";
import QuickInfoCard from "../components/trip/QuickInfoCard/QuickInfoCard";
import useDetailPage from "../hooks/useDetailPage";
import { fetchTripById, clearSelectedTrip } from "../store/tripsSlice";
import { getTripStatusLabel, getTripStatusColor } from "../utils/enums";
import { getVehicleTypeName } from "../utils/vehicleTypes";
import { formatDate, formatTime } from "../utils/dateFormat";
import { formatPrice } from "../utils/priceFormat";
import useVehicleTypes from "../hooks/useVehicleTypes";
import useAuth from "../hooks/useAuth";
import type { RootState } from "../store/store";
import type { TripOffer } from "../types/domain";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTripRatings, checkCanRate } from "../store/ratingsSlice";
import { useModalsStore } from "../globals/modalsStore";
import { useAppStore } from "../globals/appStore";
import RatingList from "../components/ratings/RatingList";
import { GradientButton } from "../mui/buttons/GradientButton";
import type { AppDispatch } from "../store/store";

const Trip = () => {
  const { t } = useTranslation("pages/trip");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isSuperAdmin } = useAuth();
  const { activeVehicleTypes } = useVehicleTypes();
  const setRatingModal = useModalsStore((state) => state.setRatingModal);
  const setRatingData = useAppStore((state) => state.setRatingData);
  const tripRatings = useSelector((state: RootState) => state.ratings.tripRatings) || [];
  const canRate = useSelector((state: RootState) => state.ratings.canRate);
  const ratingsLoading = useSelector((state: RootState) => state.ratings.loading);

  const { id, selectedItem: selectedTrip, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.trips.selectedTrip,
      loading: state.trips.loading,
      error: state.trips.error,
    }),
    fetchAction: fetchTripById,
    clearAction: clearSelectedTrip,
    backRoute: `${import.meta.env.VITE_TRIPS_ROUTE}`,
  });

  // Fetch ratings and check if user can rate when trip is loaded
  useEffect(() => {
    if (selectedTrip?.id && selectedTrip?.status === 'completed') {
      dispatch(fetchTripRatings(selectedTrip.id));
      dispatch(checkCanRate(selectedTrip.id));
    }
  }, [selectedTrip?.id, selectedTrip?.status, dispatch]);

  const handleRateClick = () => {
    if (selectedTrip?.id) {
      setRatingData({ tripId: selectedTrip.id });
      setRatingModal(true);
    }
  };

  const handleUserClick = (userId?: number) => {
    if (userId) {
      navigate(`${import.meta.env.VITE_USERS_ROUTE}/${userId}`);
    }
  };

  const handleDriverClick = (driverId?: number) => {
    if (driverId) {
      navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}/${driverId}`);
    }
  };

  const handleVehicleClick = (vehicleId?: number) => {
    if (vehicleId && selectedTrip?.accepted_vehicle?.id) {
      navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}/${vehicleId}`);
    }
  };

  const getOfferStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      accepted: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      withdrawn: "bg-gray-100 text-gray-700 border-gray-200",
      expired: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getOfferStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
      expired: "Expired",
    };
    return labels[status] || status;
  };

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_TRIPS_ROUTE}/edit/${id}`}
      deleteType="deleteTrip"
      deleteIdKey="tripId"
      editLabel={t("edit")}
      deleteLabel={t("delete")}
      showEdit={isSuperAdmin()}
      showDelete={isSuperAdmin()}
    />
  );
const acceptedOffer = selectedTrip?.offers?.find(
  (offer) => offer.status === "accepted"
);

const displayedPrice =
  acceptedOffer?.offered_price || selectedTrip?.base_price;

  return (
    <DetailPageWrapper
      loading={loading}
      error={error}
      data={selectedTrip}
      notFoundMessage={t("trip_not_found")}
      onBack={handleBack}
      backLabel={t("back_to_trips")}
    >
      <PageHeader
        title={t("trip_details")}
        backUrl={`${import.meta.env.VITE_TRIPS_ROUTE}`}
        actions={actions}
      />

      {selectedTrip && (
        <>
          {/* Trip Header Card */}
          <Paper className="paper shadow-xl !bg-gradient-to-br !from-blue-50 via-purple-50 !to-indigo-50 !border-0 !rounded-2xl overflow-hidden">
            <Box className="p-8">
              <Box className="flex items-start justify-between mb-6">
                <Box className="flex-1">
                  <Typography variant="h4" className="!font-[700] !mb-4 !text-gray-900 !text-2xl md:!text-3xl">
                    {selectedTrip.trip_title || `Trip #${selectedTrip.id}`}
                  </Typography>
                  <Box className="flex items-center gap-4 flex-wrap">
                    <Chip
                      label={getTripStatusLabel(selectedTrip.status)}
                      className={`${getTripStatusColor(selectedTrip.status)} !font-semibold !px-4 !py-2 !text-sm shadow-sm hover:shadow-md transition-shadow`}
                      size="medium"
                    />
                    {/* {selectedTrip.base_price && (
                      <Box className="px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-200">
                        <Typography variant="caption" className="!text-gray-600 !block !mb-1 !font-medium">
                          {t("base_price")}
                        </Typography>
                        <Typography variant="h6" className="!font-bold !text-green-600 !text-lg">
                          {formatPrice(selectedTrip.base_price)}
                        </Typography>
                      </Box>
                    )} */}

                 {displayedPrice && (
                    <Box className="px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-200">
                      <Typography
                        variant="caption"
                        className="!text-gray-600 !block !mb-1 !font-medium"
                      >
                        {t("final_price")}
                      </Typography>

                      <Typography
                        variant="h6"
                        className="!font-bold !text-green-600 !text-lg"
                      >
                        {formatPrice(displayedPrice)}
                      </Typography>
                    </Box>
                  )}

                  </Box>
                </Box>
              </Box>

              {/* Quick Info Grid */}
              <Box className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mt-8">
                <QuickInfoCard
                  label={t("vehicle_type")}
                  value={getVehicleTypeName(
                    selectedTrip.vehicle_type || selectedTrip.vehicle_type_id,
                    activeVehicleTypes
                  )}
                />
                {selectedTrip.scheduled_at && (
                  <QuickInfoCard
                    label={t("scheduled_at")}
                    value={
                      <Box>
                        <Typography variant="body1" className="!font-semibold !text-gray-900">
                          {formatDate(selectedTrip.scheduled_at)}
                        </Typography>
                        <Typography variant="caption" className="!text-gray-500">
                          {formatTime(selectedTrip.scheduled_at)}
                        </Typography>
                      </Box>
                    }
                  />
                )}
                <QuickInfoCard label={t("trip_id")} value={`#${selectedTrip.id}`} />
              </Box>
            </Box>
          </Paper>

          {/* Route Map */}
          {selectedTrip.pickup_lat &&
            selectedTrip.pickup_lng &&
            selectedTrip.destination_lat &&
            selectedTrip.destination_lng && (
              <Paper className="paper shadow-xl !overflow-hidden !rounded-2xl">
                <Box className="p-6 md:p-8">
                  <SectionHeader title={t("route_map")} className="mb-6" />
                  <TripMap
                    pickupLat={selectedTrip.pickup_lat}
                    pickupLng={selectedTrip.pickup_lng}
                    pickupAddress={selectedTrip.pickup_address}
                    destinationLat={selectedTrip.destination_lat}
                    destinationLng={selectedTrip.destination_lng}
                    destinationAddress={selectedTrip.destination_address}
                  />
                </Box>
              </Paper>
            )}

          {/* Locations Information */}
          <Paper className="paper shadow-xl !rounded-2xl">
            <Box className="p-6 md:p-8">
              <SectionHeader title={t("locations")} className="mb-8" />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-8">
                <LocationCard
                  title={t("pickup_location")}
                  address={selectedTrip.pickup_address}
                  date={selectedTrip.pickup_date}
                  lat={selectedTrip.pickup_lat}
                  lng={selectedTrip.pickup_lng}
                  variant="pickup"
                />
                <LocationCard
                  title={t("destination")}
                  address={selectedTrip.destination_address}
                  date={selectedTrip.destination_date}
                  lat={selectedTrip.destination_lat}
                  lng={selectedTrip.destination_lng}
                  variant="destination"
                />
              </Box>
            </Box>
          </Paper>

          {/* Additional Information */}
          {(selectedTrip.description || selectedTrip.notes || selectedTrip.weight || selectedTrip.material) && (
            <Paper className="paper shadow-xl !rounded-2xl">
              <Box className="p-6 md:p-8">
                <SectionHeader title={t("additional_information")} className="mb-6" />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-5">
                  {selectedTrip.description && (
                    <Box className="col-span-full p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <Typography variant="caption" className="!text-gray-500 !block !mb-2 !font-medium">
                        {t("description")}
                      </Typography>
                      <Typography variant="body1" className="!text-gray-900 whitespace-pre-wrap">
                        {selectedTrip.description}
                      </Typography>
                    </Box>
                  )}
                  {selectedTrip.notes && (
                    <Box className="col-span-full p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <Typography variant="caption" className="!text-blue-700 !block !mb-2 !font-semibold">
                        {t("notes")}
                      </Typography>
                      <Typography variant="body1" className="!text-gray-900 whitespace-pre-wrap">
                        {selectedTrip.notes}
                      </Typography>
                    </Box>
                  )}
                  {(selectedTrip.weight || selectedTrip.material) && (
                    <Box className="col-span-full grid grid-cols-2 md:grid-cols-1 gap-5">
                      {selectedTrip.weight && <InfoField label={t("weight")} value={selectedTrip.weight} />}
                      {selectedTrip.material && (
                        <InfoField label={t("material")} value={selectedTrip.material} />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Lifecycle Timestamps */}
          {(selectedTrip.accepted_at ||
            selectedTrip.started_at ||
            selectedTrip.completed_at ||
            selectedTrip.cancelled_at) && (
            <Paper className="paper shadow-xl !rounded-2xl">
              <Box className="p-6 md:p-8">
                <SectionHeader title={t("trip_timeline")} className="mb-6" />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-5">
                  {selectedTrip.accepted_at && (
                    <TimelineItem
                      label={t("accepted_at")}
                      date={selectedTrip.accepted_at}
                      variant="accepted"
                    />
                  )}
                  {selectedTrip.started_at && (
                    <TimelineItem label={t("started_at")} date={selectedTrip.started_at} variant="started" />
                  )}
                  {selectedTrip.completed_at && (
                    <TimelineItem
                      label={t("completed_at")}
                      date={selectedTrip.completed_at}
                      variant="completed"
                    />
                  )}
                  {selectedTrip.cancelled_at && (
                    <TimelineItem
                      label={t("cancelled_at")}
                      date={selectedTrip.cancelled_at}
                      variant="cancelled"
                    />
                  )}
                  {selectedTrip.cancellation_reason && (
                    <Box className="col-span-full p-5 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                      <Typography variant="caption" className="!text-red-700 !block !mb-2 !font-semibold">
                        {t("cancellation_reason")}
                      </Typography>
                      <Typography variant="body1" className="!text-gray-900">
                        {selectedTrip.cancellation_reason}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Trip Tracking Tree */}
          <Paper className="paper shadow-xl !rounded-2xl">
            <Box className="p-6 md:p-8">
              <SectionHeader title={t("trip_tracking")} className="mb-6" />
              <TripTrackingTree trip={selectedTrip} />
            </Box>
          </Paper>

          {/* User Information */}
          {selectedTrip.user && (
            <Paper className="paper shadow-xl !rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <Box className="p-6 md:p-8">
                <SectionHeader title={t("user_information")} className="mb-6" />
                <UserInfoCard
                  photoUrl={selectedTrip.user.photo_url}
                  name={selectedTrip.user.name}
                  email={selectedTrip.user.email}
                  phone={selectedTrip.user.phone}
                  address={selectedTrip.user.address}
                  onClick={() => handleUserClick(selectedTrip.user?.id)}
                />
              </Box>
            </Paper>
          )}

          {/* Accepted Driver Information */}
          {selectedTrip.accepted_driver && selectedTrip.accepted_driver.user && (
            <Paper className="paper shadow-xl !rounded-2xl hover:shadow-2xl transition-all duration-300">
              <Box className="p-6 md:p-8">
                <SectionHeader title={t("accepted_driver_information")} className="mb-6" />
                <Box
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 p-5 rounded-xl transition-all border-2 border-transparent hover:border-green-200"
                  onClick={() => handleDriverClick(selectedTrip.accepted_driver?.id)}
                >
                  <UserInfoCard
                    photoUrl={selectedTrip.accepted_driver.user.photo_url}
                    name={selectedTrip.accepted_driver.user.name}
                    email={selectedTrip.accepted_driver.user.email}
                    phone={selectedTrip.accepted_driver.user.phone}
                  />
                </Box>
              </Box>
            </Paper>
          )}

          {/* Accepted Vehicle Information */}
          {selectedTrip.accepted_vehicle && (
            <Paper className="paper shadow-xl !rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <Box className="p-6 md:p-8">
                <SectionHeader title={t("accepted_vehicle_information")} className="mb-6" />
                <VehicleInfoCard
                  make={selectedTrip.accepted_vehicle.make}
                  model={selectedTrip.accepted_vehicle.model}
                  year={selectedTrip.accepted_vehicle.year}
                  color={selectedTrip.accepted_vehicle.color}
                  licensePlate={selectedTrip.accepted_vehicle.license_plate}
                  vehicleType={selectedTrip.accepted_vehicle.vehicle_type}
                  vehicleTypeId={selectedTrip.accepted_vehicle.vehicle_type_id}
                  activeVehicleTypes={activeVehicleTypes}
                  onClick={() => handleVehicleClick(selectedTrip.accepted_vehicle?.id)}
                />
              </Box>
            </Paper>
          )}

          {/* Ratings Section */}
          {selectedTrip.status === 'completed' && (
            <Paper className="paper shadow-xl !rounded-2xl">
              <Box className="p-6 md:p-8">
                <Box className="flex items-center justify-between mb-6">
                  <SectionHeader title={t("ratings", { defaultValue: "Ratings & Reviews" })} />
                  {canRate && (
                    <GradientButton onClick={handleRateClick} className="!px-6 !py-2.5">
                      {t("rateTrip", { defaultValue: "Rate Trip" })}
                    </GradientButton>
                  )}
                </Box>
                {ratingsLoading ? (
                  <Typography variant="body2" className="text-gray-500 text-center py-8">
                    {t("loadingRatings", { defaultValue: "Loading ratings..." })}
                  </Typography>
                ) : (
                  <RatingList
                    ratings={tripRatings}
                    showDetails={true}
                    emptyMessage={t("noRatingsYet", { defaultValue: "No ratings yet. Be the first to rate!" })}
                  />
                )}
              </Box>
            </Paper>
          )}

          {/* Trip Offers */}
          <Paper className="paper shadow-xl !rounded-2xl">
            <Box className="p-6 md:p-8">
              <SectionHeader title={t("trip_offers")} className="mb-8" />
              {selectedTrip.offers && selectedTrip.offers.length > 0 ? (
                <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedTrip.offers.map((offer: TripOffer) => (
                    <TripOfferCard
                      key={offer.id}
                      offer={offer}
                      basePrice={selectedTrip.base_price}
                      onDriverClick={handleDriverClick}
                      onVehicleClick={handleVehicleClick}
                      getOfferStatusColor={getOfferStatusColor}
                      getOfferStatusLabel={getOfferStatusLabel}
                      t={t}
                    />
                  ))}
                </Box>
              ) : (
                <Box className="text-center py-12">
                  <Typography variant="body1" className="!text-gray-500">
                    {t("no_offers")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </>
      )}
    </DetailPageWrapper>
  );
};

export default Trip;
