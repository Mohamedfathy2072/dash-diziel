import * as yup from "yup";
import useQueries from "../../hooks/useQueries";

const useFilterDriversSchema = () => {
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const FilterDriversSchema = yup.object({
    name1: yup.string(),
    status: yup.string(),
  });

  const FilterDriversInitialValues = {
    name1: queries["name1"] || "",
    status: queries["status"] || "",
  };

  return { FilterDriversSchema, FilterDriversInitialValues };
};

export default useFilterDriversSchema;

