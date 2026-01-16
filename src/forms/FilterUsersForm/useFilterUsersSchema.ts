import * as yup from "yup";
import useQueries from "../../hooks/useQueries";

const useFilterUsersSchema = () => {
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const FilterUsersSchema = yup.object({
    name1: yup.string(),
  });

  const FilterUsersInitialValues = {
    name1: queries["name1"] || "",
  };

  return { FilterUsersSchema, FilterUsersInitialValues };
};

export default useFilterUsersSchema;
