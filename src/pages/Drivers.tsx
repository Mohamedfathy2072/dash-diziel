import DriversSection from "../sections/DriversSection/DriversSection";
import * as XLSX from "xlsx";
import { Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DownloadIcon, Upload } from "lucide-react";
import { useState } from "react";
import { driverService } from "../services/api";
import { handleToaster } from "../functions/handleToaster";
import { useTranslation } from "react-i18next";
const Drivers = () => {
  const { t } = useTranslation("sections/drivers_section");
  const { t: tCommon } = useTranslation("common");
  const actionBtnSx = {
    borderRadius: 2,
    px: 2.5,
    py: 1,
    fontWeight: 500,
    textTransform: "none",
  };
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {
        cellFormula: false,
        cellStyles: false,
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const processedData = jsonData.map((row: any) => {
        const processedRow: any = { ...row };

        if (processedRow.phone !== undefined && processedRow.phone !== null) {
          processedRow.phone = String(processedRow.phone).trim();
        }
        if (
          processedRow.national_id !== undefined &&
          processedRow.national_id !== null
        ) {
          processedRow.national_id = String(processedRow.national_id).trim();
        }
        if (
          processedRow.license_number !== undefined &&
          processedRow.license_number !== null
        ) {
          processedRow.license_number = String(
            processedRow.license_number,
          ).trim();
        }

        return processedRow;
      });

      const newWorksheet = XLSX.utils.json_to_sheet(processedData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Drivers");

      const processedBlob = new Blob(
        [XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" })],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      );
      const processedFile = new File([processedBlob], file.name, {
        type: file.type,
      });

      const res = await driverService.importDrivers(processedFile);
      const response = res.data;
      if (response.success) {
        const imported = response.data?.imported ?? 0;
        const failed = response.data?.failed ?? 0;

        handleToaster({
          msg: tCommon("successImportDriver", {
            imported,
            failed,
          }),
          status: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        setFile(null);
      } else {
        const errorMsg =
          response.errors?.error ||
          t(response.message) ||
          tCommon("failImportDriver");

        handleToaster({
          msg: errorMsg,
          status: "error",
        });
      }

      setFile(null);
      console.log(res.data);
    } catch (err: any) {
      const response = err?.response?.data;

      const errorMsg =
        response?.errors?.error ||
        t(response?.message) ||
        tCommon("importUnexpectedError");

      handleToaster({
        msg: errorMsg,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    const allowedExtensions = ["xlsx", "xls", "csv"];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      handleToaster({
        msg: tCommon("onlyExcelCSVAllowed"),
        status: "error",
      });

      e.target.value = "";
      return;
    }
    setFile(selectedFile);
  };
  const downloadDriversTemplate = () => {
    const headers = [
      [
        "name",
        "email",
        "phone",
        "password",
        "address",
        "national_id",
        "license_number",
        "license_class",
        "license_issuing_state",
        "license_issuing_country",
        "emergency_contact_name",
        "emergency_contact_phone",
      ],
    ];

    const exampleRow = [
      "Islam Mohamed",
      "islamMohamed11@example.com",
      "01234512345",
      "password333",
      "Cairo",
      "12345678900033",
      "DL123496",
      "A",
      "Alex",
      "EGY",
      "Mohamed Ahmed Awad",
      "01122334455",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, exampleRow]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");

    XLSX.writeFile(workbook, "drivers_import_template.xlsx");
  };

  return (
    <>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent={"end"}
        gap={2}
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon className="me-2" />}
          size="small"
          sx={actionBtnSx}
          onClick={downloadDriversTemplate}
        >
          {tCommon("downloedExcelTemplate")}
        </Button>

        <Button
          component="label"
          color="primary"
          size="small"
          startIcon={<Upload className="me-2" />}
          sx={{
            ...actionBtnSx,
            bgcolor: "primary.50",
            border: "1px dashed",
            borderColor: "primary.300",
            "&:hover": {
              bgcolor: "primary.100",
            },
          }}
        >
          {file ? file.name : tCommon("selectedFileExcel")}
          <input
            hidden
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
          />
        </Button>

        <LoadingButton
          loading={loading}
          disabled={!file}
          variant="contained"
          size="small"
          sx={actionBtnSx}
          onClick={handleImport}
        >
          {tCommon("uploadDrivers")}
        </LoadingButton>
      </Stack>
      <DriversSection />
    </>
  );
};

export default Drivers;
