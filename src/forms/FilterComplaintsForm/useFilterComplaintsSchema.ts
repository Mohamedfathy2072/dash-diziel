import * as yup from "yup";
import useQueries from "../../hooks/useQueries";

const useFilterComplaintsSchema = () => {
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const FilterComplaintsSchema = yup.object({
    status: yup.string().nullable(),
    user_id: yup.string().nullable(),
    complaintable_type: yup.string().nullable(),
    subject: yup.string().nullable(),
  });

  const FilterComplaintsInitialValues = {
    status: queries["status"] || "",
    user_id: queries["user_id"] || "",
    complaintable_type: queries["complaintable_type"] || "",
    subject: queries["subject"] || "",
  };

  return { FilterComplaintsSchema, FilterComplaintsInitialValues };
};

export default useFilterComplaintsSchema;

