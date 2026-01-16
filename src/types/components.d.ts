import type CheckboxProps from "@mui/material/CheckboxProps";
import type RadioProps from "@mui/material/RadioProps";
import type SwitchProps from "@mui/material/SwitchProps";
import type { ReactNode } from "react";

interface LogoTypes {
  theme?: "dark" | "light";
  className?: string;
  noHome?: boolean;
  variant?: "logo";
}

interface StatisticalCardTypes {
  title: string;
  subtitle?: string;
  number: string;
  bg: string;
  color: string;
  icon?: ReactNode;
}

interface StatusBoxTypes {
  status: string;
  list?: string[];
  variant?: string;
  handleSelect?: (status: string) => void;
  loading?: boolean;
  valueList?: Array<{ value: string; label: string }>;
  selectedValue?: string;
  onValueSelect?: (value: string) => void;
}

interface FilterChipsTypes {
  variant?: string;
  onClose: (key: string) => void;
}

interface DotTypes {
  color?: string;
  className?: string;
  style?: CSSProperties;
}

interface CustomMenuTypes {
  children: ReactNode;
  button?: ReactNode;
  limit?: boolean;
  className?: string;
}

interface InputTypes<T> {
  formik?: FormikProps<T>;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  select?: boolean;
  options?: Array<string>;
  values?: string[];
  icon?: ReactNode;
  ac?: string;
  value?: string;
  textarea?: boolean;
  rows?: number;
  disabled?: boolean;
  labeled?: string;
  labeledColor?: string;
  optional?: boolean;
  loading?: boolean;
  question?: boolean;
  filter?: boolean;
  amount?: boolean;
  currency?: boolean;
  precentage?: boolean;
  note?: string;
  max?: number;
  change?: (value: string) => void;
  reasonName?: string;
  choose?: boolean;
  autoFocus?: boolean;
  autocomplete?: boolean;
}

interface SelectTypes<T> {
  formik?: FormikProps<T>;
  name: string;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  filter?: boolean;
  options?: string[];
  values?: string[];
  error?: boolean;
  helperText?: string;
  choose?: boolean;
  value?: string;
  change?: (value: string) => void;
}

interface TextareaTypes<T> {
  formik?: FormikProps<T>;
  disabled?: boolean;
  label?: string;
  name: string;
  rows?: number;
  placeholder?: string;
  max?: number;
  error?: boolean;
  helperText?: string;
  value?: string;
  change?: (value: string) => void;
}

interface PrecentageTypes<T> {
  formik?: FormikProps<T>;
  name: string;
  disabled?: boolean;
  label?: string;
  change?: (value: string) => void;
  type?: string;
  showPassword: boolean;
  value?: string;
  icon?: ReactNode;
  togglePassword: () => void;
  handleMouseDownPassword: (event: MouseEvent<HTMLButtonElement>) => void;
  placeholder?: string;
  ac?: string;
  note?: string;
  helperText?: string;
  error?: boolean;
  amount?: boolean;
}

interface CurrencyTypes<T> {
  formik?: FormikProps<T>;
  name: string;
  disabled?: boolean;
  label?: string;
  type?: string;
  showPassword: boolean;
  icon?: ReactNode;
  note?: string;
  value?: string;
  placeholder?: string;
  error?: boolean;
  ac?: string;
  helperText?: string;
  amount?: boolean;
  change?: (value: string) => void;
  togglePassword: () => void;
  handleMouseDownPassword: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface PhoneNumberInputTypes {
  value?: string;
  onChange?: (value: string) => void;
  country?: string;
  label?: string;
  name?: string;
  optional?: boolean;
}

interface FilterChipsTypes {
  onClose: (key: string) => void;
}

interface TextLineTypes {
  title: string;
  value: string;
  textColor?: string;
  valueColor?: string;
}

interface TextLabelTypes {
  title?: string;
  subTitle?: string;
  value?: string;
  tel?: boolean;
  password?: boolean;
  className?: string;
  rows?: number;
  onClick?: () => void;
  variant?:
    | "employee"
    | "member"
    | "payment"
    | "user"
    | "network"
    | "package"
    | "reject_reason"
    | "highlight"
    | "admin"
    | "complaint";
}

interface ImageBoxTypes {
  className?: string;
  lazy?: boolean;
  src: string;
  alt?: string;
  children?: ReactNode;
  variant?: string;
}

interface ButtonTypes {
  icon?: ReactNode;
  title?: string;
  bg?: string;
  variant?: string;
  type?: "button" | "submit";
  handling?: () => void;
  loading?: boolean;
}

interface SubmitButtonTypes {
  loading: boolean;
  children: ReactNode;
  variant?: "gradient" | "primary" | "secondary" | "basic" | "error";
  className?: string;
  handling?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  id?: string;
}

interface ProfileTitleTypes {
  title: string;
}

interface ProfileAvatarTypes {
  image: string;
}

interface CounterCardTypes {
  icon: ReactNode;
  number: string;
  unit: string;
  title: string;
  back: ReactNode;
  iconClassName: string;
}

interface BalanceCardTypes {
  number: string;
  title: string;
  bgColor: string;
  btn?: boolean;
}

interface ProfileEmployeeCardTypes {
  title: string;
  number: string;
  rate: number;
  bg: string;
  color: string;
}

interface ProfileManagerCardTypes {
  title: string;
  name: string;
  email: string;
  phone: string;
}

interface TableIconButtonTypes {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TextLabelTypes {
  title?: string;
  value?: string;
  tel?: boolean;
  variant?: "employee" | "member" | "payment" | "user";
}

interface TextLineTypes {
  title: string;
  value: string;
  valueColor?: string;
}

interface UploadFilesTypes {
  handle: (file: File) => Promise<boolean>;
}

interface ProviderBoxTypes {
  type: string;
  networkLevel: string;
  name: string;
  image?: string;
  showLocation?: boolean;
  selected?: boolean;
  isSelect?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
}
interface SidebarItemTypes {
  icon: ReactNode;
  title: string | ReactNode;
  link?: string;
  logout?: boolean;
  index?: number;
  onLogout?: () => void;
  onClick?: () => void;
}

interface SidebarTypes {
  children: ReactNode;
}

interface NewSidebarTypes {
  items: ItemSidebarTypes[];
  logoutItem: ItemLogoutSidebarTypes;
  open?: boolean;
  handleToggleSidebar?: () => void;
}

interface ItemSidebarTypes {
  key: string;
  icon: ReactNode;
  title: string | ReactNode;
  link: string;
  visible: boolean;
  onClick?: () => void;
}

interface ItemLogoutSidebarTypes {
  key: string;
  icon: ReactNode;
  title: string;
  handle?: () => void;
}

interface PermissionCardTypes {
  title: string;
  children: ReactNode;
  value?: boolean;
  onChange?: (val: boolean) => void;
}

interface CustomCheckboxTypes {
  label?: string;
  labelPlacement?: "start" | "end";
  checboxProps?: CheckboxProps;
  value?: boolean;
  disabled?: boolean;
  onChange?: (val: boolean) => void;
}

interface CustomRadioTypes {
  label?: string;
  labelPlacement?: "start" | "end";
  radioProps?: RadioProps;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface CustomSwitchTypes {
  label?: string;
  labelPlacement?: "start" | "end";
  switchProps?: SwitchProps;
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  name?: string;
}

interface DefaultNetworkTypes {
  value: string;
  data: string;
  title: string;
  providers_count: number;
  handleChange?: (val: string) => void;
}

interface DefaultPackageTypes {
  value: string;
  data: string;
  title: string;
  handleChange?: (val: string) => void;
}

interface NetworkLevelCardTypes {
  value?: string;
  data: string;
  title1: string;
  title2: string;
  handleChange?: (val: string) => void;
}

type PrimaryPaginationEntities = "users" | "drivers" | "vehicles" | "trips" | "vehicleTypes" | "coupons";

interface PrimaryPaginationTypes {
  count?: number;
  loading: boolean;
  variant: PrimaryPaginationEntities;
}

interface HeaderTypes {
  avatar?: string;
  variant?: "reviewer" | "superAdmin" | "sales";
  handleToggleSidebar?: () => void;
  handleNotification?: () => void;
  handleNotifications?: (event: MouseEvent<HTMLButtonElement>) => void;
  openNotifications?: boolean;
  noShadow?: boolean;
  noHome?: boolean;
  noNotifications?: boolean;
  locale?: i18n;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  actions?: ReactNode;
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
  className?: string;
}

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  className?: string;
}

interface PhotoUploadProps {
  value?: string | null;
  onChange?: (file: File, preview: string) => void;
  onRemove?: () => void;
  preview?: string | null;
  size?: number;
  photoFileRef?: React.MutableRefObject<File | null>;
  formik?: FormikProps<any>;
  name?: string;
}

interface InfoFieldProps {
  label: string;
  value: string | null | undefined | React.ReactNode;
  className?: string;
}

interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

interface DocumentUploadProps {
  type: string;
  label: string;
  onChange?: (file: File | null, type: string) => void;
  value?: File | null;
  accept?: string;
  maxSize?: number;
  className?: string;
}

interface RejectionReasonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
  label?: string;
  placeholder?: string;
}

export type {
  BalanceCardTypes,
  ButtonTypes,
  CounterCardTypes,
  CurrencyTypes,
  CustomCheckboxTypes,
  CustomMenuTypes,
  CustomRadioTypes,
  CustomSwitchTypes,
  DefaultNetworkTypes,
  DefaultPackageTypes,
  DocumentUploadProps,
  DotTypes,
  FilterChipsTypes,
  FormSectionProps,
  HeaderTypes,
  ImageBoxTypes,
  InfoCardProps,
  InfoFieldProps,
  InputTypes,
  InputTypes,
  ItemLogoutSidebarTypes,
  ItemSidebarTypes,
  LogoTypes,
  NetworkLevelCardTypes,
  NewSidebarTypes,
  PageHeaderProps,
  PermissionCardTypes,
  PhoneNumberInputTypes,
  PhoneNumberInputTypes,
  PhotoUploadProps,
  PrecentageTypes,
  PrimaryPaginationEntities,
  PrimaryPaginationTypes,
  ProfileAvatarTypes,
  ProfileEmployeeCardTypes,
  ProfileManagerCardTypes,
  ProfileTitleTypes,
  ProviderBoxTypes,
  RejectionReasonModalProps,
  SectionHeaderProps,
  SelectTypes,
  SidebarItemTypes,
  SidebarTypes,
  StatisticalCardTypes,
  StatusBoxTypes,
  SubmitButtonTypes,
  TableIconButtonTypes,
  TextareaTypes,
  TextLabelTypes,
  TextLineTypes,
  TextLineTypes,
  UploadFilesTypes,
};
