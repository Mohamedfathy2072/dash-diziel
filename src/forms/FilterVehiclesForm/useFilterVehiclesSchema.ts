import * as yup from "yup";
import useQueries from "../../hooks/useQueries";
import type { FilterVehiclesFormTypes } from "../../types/forms";

const useFilterVehiclesSchema = () => {
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const FilterVehiclesSchema = yup.object({
    status: yup.string().nullable(),
    verification_status: yup.string().nullable(),
    vehicle_type_id: yup.number().nullable().transform((value, originalValue) => {
      // Handle string query params
      if (typeof originalValue === 'string' && originalValue !== '') {
        const parsed = parseInt(originalValue, 10);
        return isNaN(parsed) ? null : parsed;
      }
      return value;
    }),
    make: yup.string().nullable(),
    model: yup.string().nullable(),
    license_plate: yup.string().nullable(),
    driver_id: yup.string().nullable(),
  });

  const FilterVehiclesInitialValues: FilterVehiclesFormTypes = {
    status: queries["status"] || "",
    verification_status: queries["verification_status"] || "",
    vehicle_type_id: queries["vehicle_type_id"] || queries["vehicle_type"] || "",
    make: queries["make"] || "",
    model: queries["model"] || "",
    license_plate: queries["license_plate"] || "",
    driver_id: queries["driver_id"] || "",
  };

  return { FilterVehiclesSchema, FilterVehiclesInitialValues };
};

export default useFilterVehiclesSchema;
