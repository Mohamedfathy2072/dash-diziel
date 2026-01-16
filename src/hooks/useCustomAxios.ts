import { useAppStore } from "../globals/appStore";
import { useFormsStore } from "../globals/formsStore";
import useAxios from "./useAxios";

const useCustomAxios = () => {
  const setLoading = useFormsStore((state) => state.setLoading);
  const setBackdrop = useAppStore((state) => state.setBackdrop);

  const { server } = useAxios(
    (loading: boolean) => setLoading(loading),
    (value: boolean) => setBackdrop(value),
  );
  return { server };
};

export default useCustomAxios;
