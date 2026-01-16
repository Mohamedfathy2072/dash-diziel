import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "../../icons/CheckCircleIcon";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GradientButton } from "../../mui/buttons/GradientButton";
import InfoCard from "../../components/common/InfoCard/InfoCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { driverService } from "../../services/api";
import { handleToaster } from "../../functions/handleToaster";
import type { RootState } from "../../store/store";
import { useFormik } from "formik";
import useDepositSchema from "../../forms/DepositForm/useDepositSchema";
import useDepositSubmit from "../../forms/DepositForm/useDepositSubmit";
import DepositForm from "../../forms/DepositForm/DepositForm";

interface Wallet {
  id: number;
  driver_id: number;
  balance: number;
  pending_balance: number;
  total_earnings: number;
  total_withdrawn: number;
  currency: string;
  is_active: boolean;
  last_transaction_at?: string | null;
}

interface WalletBalance {
  balance: number;
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  total_withdrawn: number;
  currency: string;
}

const DriverWalletSection = () => {
  const { t } = useTranslation("sections/driver_wallet_section");
  const { id } = useParams();
  const { selectedDriver } = useSelector((state: RootState) => state.drivers);
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.type === 'superAdmin';
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const { DepositInitialValues, DepositSchema } = useDepositSchema();
  const { addDeposit } = useDepositSubmit();

  const formik = useFormik({
    initialValues: DepositInitialValues,
    validationSchema: DepositSchema,
    onSubmit: async (values) => {
      await addDeposit(values, () => {
        setDepositModalOpen(false);
        formik.resetForm();
        fetchWallet();
      });
    },
  });

  const fetchWallet = async () => {
    if (!id || !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const response = await driverService.getWallet(id);
      const responseData = response.data?.data;
      
      if (responseData?.wallet) {
        setWallet(responseData.wallet);
      }
      if (responseData?.balance) {
        setBalance(responseData.balance);
      }
    } catch (error: any) {
      // Only show error if it's not a 404 or permission error (user might not have wallet yet)
      const status = error?.response?.status;
      if (status !== 404 && status !== 403) {
        handleToaster({
          msg: error?.response?.data?.message || error?.message || t("errorLoadingWallet", { defaultValue: "Error loading wallet" }),
          status: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && selectedDriver?.id && isSuperAdmin) {
      fetchWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedDriver?.id, isSuperAdmin]);

  const handleCloseModal = () => {
    setDepositModalOpen(false);
    formik.resetForm();
  };

  // Don't render if not SuperAdmin
  if (!isSuperAdmin) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </Box>
    );
  }

  // If no wallet data, don't render the section at all (don't show empty state)
  // This prevents errors when wallet endpoint doesn't exist or user doesn't have wallet
  if (!wallet || !balance) {
    return null;
  }

  const isDebt = Number(balance.balance) < 0;

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <Paper className="paper !overflow-hidden">
        <Box className="p-6">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h6" className="!font-[600]">
              {t("driverWallet", { defaultValue: "Driver Wallet" })}
            </Typography>
            <GradientButton
              onClick={() => setDepositModalOpen(true)}
              className="!px-6 !py-2.5"
            >
              ➕ {t("addManualDeposit", { defaultValue: "Add Manual Deposit" })}
            </GradientButton>
          </Box>

          {/* Balance Cards */}
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <InfoCard
              icon={<CheckCircleIcon className="w-5 h-5 !text-[#003366]" />}
              label={t("currentBalance", { defaultValue: "Current Balance" })}
              value={`${isDebt ? '⚠️' : '✅'} ${Math.abs(Number(balance.balance)).toFixed(2)} ${balance.currency}`}
              className={isDebt ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}
            />
            {isDebt && (
              <InfoCard
                icon={<CheckCircleIcon className="w-5 h-5 !text-red-600" />}
                label={t("outstandingDebt", { defaultValue: "Outstanding Debt" })}
                value={`${Math.abs(Number(balance.balance)).toFixed(2)} ${balance.currency}`}
                className="border-red-200 bg-red-50"
              />
            )}
            <InfoCard
              icon={<CheckCircleIcon className="w-5 h-5 !text-[#003366]" />}
              label={t("availableBalance", { defaultValue: "Available Balance" })}
              value={`${Number(balance.available_balance).toFixed(2)} ${balance.currency}`}
            />
            <InfoCard
              icon={<CheckCircleIcon className="w-5 h-5 !text-[#003366]" />}
              label={t("pendingBalance", { defaultValue: "Pending Balance" })}
              value={`${Number(balance.pending_balance).toFixed(2)} ${balance.currency}`}
            />
            <InfoCard
              icon={<CheckCircleIcon className="w-5 h-5 !text-[#003366]" />}
              label={t("totalEarnings", { defaultValue: "Total Earnings" })}
              value={`${Number(balance.total_earnings).toFixed(2)} ${balance.currency}`}
            />
            <InfoCard
              icon={<CheckCircleIcon className="w-5 h-5 !text-[#003366]" />}
              label={t("totalWithdrawn", { defaultValue: "Total Withdrawn" })}
              value={`${Number(balance.total_withdrawn).toFixed(2)} ${balance.currency}`}
            />
          </Box>

          {isDebt && (
            <Box className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Typography variant="body2" className="!text-red-800 !font-[500]">
                ⚠️ {t("debtWarning", { 
                  defaultValue: `This driver has an outstanding debt of {{amount}} {{currency}}. Please add a deposit to settle the debt.`,
                  amount: Math.abs(Number(balance.balance)).toFixed(2),
                  currency: balance.currency
                })}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Deposit Modal */}
      <Dialog 
        open={depositModalOpen} 
        onClose={handleCloseModal} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          ➕ {t("addManualDeposit", { defaultValue: "Add Manual Deposit" })}
        </DialogTitle>
        <DialogContent>
          <Box className="mt-4">
            <DepositForm
              formik={formik}
              driverName={selectedDriver?.name}
              onCancel={handleCloseModal}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DriverWalletSection;

