import * as yup from "yup";

const useDeleteSchema = () => {
  const DeleteSchema = yup.object({});

  const DeleteInitialValues = {};

  return { DeleteSchema, DeleteInitialValues };
};

export default useDeleteSchema;
