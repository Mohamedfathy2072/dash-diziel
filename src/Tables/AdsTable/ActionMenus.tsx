import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Ad } from "../../types/domain";

const ActionMenus = ({ ad }: { ad: Ad }) => {
  return (
    <EntityActionMenu
      entity={ad}
      editRoute={(id) => `${import.meta.env.VITE_ADS_ROUTE || "/ads"}/edit/${id}`}
      deleteType="deleteAd"
      deleteIdKey="adId"
    />
  );
};

export default ActionMenus;

