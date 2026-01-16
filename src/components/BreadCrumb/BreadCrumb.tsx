import { Breadcrumbs } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import ChevronRightIcon from "../../icons/ChevronRightIcon";

const BreadCrumb = ({
  last,
  name,
}: {
  last?: boolean;
  name?: string;
}) => {
  const location = useLocation();
  const { t } = useTranslation("components/breadcrumb");

  const crumbs = location.pathname.split("/").filter((part) => part !== "");

  const buildPath = (index: number) =>
    "/" + crumbs.slice(0, index + 1).join("/");

  return last ? (
    <span className="text-gray-400 !font-[500] subtitle2 !p-0">
      {crumbs[crumbs.length - 1]}
    </span>
  ) : (
    <Breadcrumbs
      separator={
        <ChevronRightIcon className="w-[16px] h-auto" />
      }
      aria-label="breadcrumb"
    >
      <Link
        key="home"
        to={`${import.meta.env.VITE_DASHBOARD_ROUTE}`}
        className="!font-[600] subtitle1 transition-all hover:text-primary hover:underline !p-0"
      >
        {t("home")}
      </Link>

      {crumbs.map((crumb, index) => {
        const to = buildPath(index);
        const isLast = index === crumbs.length - 1;

        const displayName = t(
          `crumbs.${crumb}`,
          decodeURIComponent(crumb)
        );

        return isLast || crumb === "add" || crumb === "edit" ? (
          <span key={to} className="text-gray-400 !font-[500] subtitle2 !p-0">
            {crumb === "add" || crumb === "edit"
              ? displayName
              : name || displayName}
          </span>
        ) : (
          <Link
            key={to}
            to={to}
            className="!font-[600] text-black subtitle1 transition-all hover:text-primary hover:underline !p-0"
          >
            {displayName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
