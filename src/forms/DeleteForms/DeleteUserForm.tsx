import { useTranslation } from "react-i18next";
import Delete from "./Delete";

const DeleteUserForm = () => {
    const { t } = useTranslation("forms/delete_user_form");

    return (
        <Delete
            title={t("title", { defaultValue: "حذف المستخدم" })}
            description={t("description", { defaultValue: "هل أنت متأكد أنك تريد حذف المستخدم؟" })}
        />
    );
};

export default DeleteUserForm;
