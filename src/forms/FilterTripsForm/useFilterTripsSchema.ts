import * as yup from "yup";
import useQueries from "../../hooks/useQueries";

const useFilterTripsSchema = () => {
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const FilterTripsSchema = yup.object({
    status: yup.string().nullable(),
    vehicle_type_id: yup.number().nullable().transform((value, originalValue) => {
      // Handle string query params
      if (typeof originalValue === 'string' && originalValue !== '') {
        const parsed = parseInt(originalValue, 10);
        return isNaN(parsed) ? null : parsed;
      }
      return value;
    }),
    user_id: yup.string().nullable(),
    driver_id: yup.string().nullable(),
    pickup_address: yup.string().nullable(),
    destination_address: yup.string().nullable(),
  });

  const FilterTripsInitialValues = {
    status: queries["status"] || "",
    vehicle_type_id: queries["vehicle_type_id"] || queries["vehicle_type"] || "",
    user_id: queries["user_id"] || "",
    driver_id: queries["driver_id"] || "",
    pickup_address: queries["pickup_address"] || "",
    destination_address: queries["destination_address"] || "",
  };

  return { FilterTripsSchema, FilterTripsInitialValues };
};

export default useFilterTripsSchema;
