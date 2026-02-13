import VehiclesSection from "../sections/VehiclesSection/VehiclesSection";
import * as XLSX from "xlsx";
import { Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DownloadIcon, Upload } from "lucide-react";
import { useState } from "react";
import { vehicleService } from "../services/api";
import { handleToaster } from "../functions/handleToaster";
import { useTranslation } from "react-i18next";

const Vehicles = () => {
  const { t } = useTranslation("sections/vehicles_section");
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

        if (
          processedRow.license_plate !== undefined &&
          processedRow.license_plate !== null
        ) {
          processedRow.license_plate = String(
            processedRow.license_plate,
          ).trim();
        }
        if (processedRow.vin !== undefined && processedRow.vin !== null) {
          processedRow.vin = String(processedRow.vin).trim();
        }
        if (
          processedRow.registration_number !== undefined &&
          processedRow.registration_number !== null
        ) {
          processedRow.registration_number = String(
            processedRow.registration_number,
          ).trim();
        }

        return processedRow;
      });

      const newWorksheet = XLSX.utils.json_to_sheet(processedData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Vehicles");

      const processedBlob = new Blob(
        [XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" })],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      );
      const processedFile = new File([processedBlob], file.name, {
        type: file.type,
      });

      const res = await vehicleService.importVehicles(processedFile);
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
          tCommon("failImportVehicles");

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

  const downloadVehiclesTemplate = () => {
    const headers = [
      [
        "driver_phone",
        "color",
        "head_make",
        "head_model",
        "head_year",
        "head_license_plate",
        "head_vin",
        "head_chassis_number",
        "head_engine_number",
        "head_number_of_axles",
        "head_max_load",
        "head_length",
        "trailer_make",
        "trailer_model",
        "trailer_year",
        "trailer_license_plate",
        "trailer_vin",
        "trailer_chassis_number",
        "trailer_number_of_axles",
        "trailer_max_load",
        "trailer_length",
      ],
    ];

    const exampleRow = [
      "01234567890", // driver_phone
      "Blue", // color
      // رأس الشاحنة
      "Toyota", // head_make
      "Camry", // head_model
      2020, // head_year
      "ABC-123", // head_license_plate
      "1HGBH41JXMN109186", // head_vin
      "CH123456789", // head_chassis_number
      "ENG123456", // head_engine_number
      3, // head_number_of_axles
      5000.5, // head_max_load
      12.5, // head_length
      // المقطورة
      "Schmitz", // trailer_make
      "Cargobull", // trailer_model
      2021, // trailer_year
      "XYZ-456", // trailer_license_plate
      "TR123456789", // trailer_vin (اختياري)
      "CH987654321", // trailer_chassis_number
      4, // trailer_number_of_axles
      10000.0, // trailer_max_load
      15.0, // trailer_length
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, exampleRow]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");

    XLSX.writeFile(workbook, "vehicles_import_template.xlsx");
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
          onClick={downloadVehiclesTemplate}
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
          {tCommon("uploadVehicles")}
        </LoadingButton>
      </Stack>
      <VehiclesSection />
    </>
  );
};

export default Vehicles;
