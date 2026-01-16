import type {
  ApprovalTypes,
  BenefitTypes,
  CityTypes,
  ClaimTypes,
  superAdminTypes,
  CountryTypes,
  EditRequestNetworkTypes,
  EditRequestPackageTypes,
  EmployeeTypes,
  GenderTypes,
  JobTitleTypes,
  MainProviderTypes,
  NetworkLevelTypes,
  NetworkTypes,
  PackageTypes,
  ProviderBranchTypes,
  ProviderTypeTypes,
  RoleTypes,
  TransactionTypes,
  UserTypes
} from "./app";

interface AuthValuesTypes {
  user: UserTypes | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface ProfileValuesTypes {
  profile?: superAdminTypes;
  loading: boolean;
}

interface EmployeesValuesTypes {
  employees?: EmployeeTypes[];
  employeesCount?: number;
  loading: boolean;
}

interface EmployeeValuesTypes {
  employee?: EmployeeTypes;
  loading: boolean;
}

interface ProvidersBranchesValuesTypes {
  providersBranches?: ProviderBranchTypes[];
  providersBranchesWithType?: ProviderBranchTypes[];
  providersBranchesMPN?: ProviderBranchTypes[];
  providersBranchesCount?: number;
  loading: boolean;
}

interface ProviderBranchValuesTypes {
  providerBranch?: ProviderBranchTypes;
  loading: boolean;
}

interface ProviderTypesValuesTypes {
  providerTypes?: ProviderTypeTypes[];
  providerTypesCount?: number;
  loading: boolean;
}

interface MostUsedProvidersValuesTypes {
  mostUsedProviders?: MainProviderTypes[];
  loading: boolean;
}

interface MostUsedClaimsValuesTypes {
  mostUsedClaims?: ClaimTypes[];
  loading: boolean;
}

interface RolesValuesTypes {
  roles?: RoleTypes[];
  rolesCount?: number;
  loading: boolean;
}

interface RoleValuesTypes {
  role?: RoleTypes;
  loading: boolean;
}

interface ClaimsCountValuesTypes {
  claimsCount?: {
    year: number;
    month: number;
    count: number;
    pending_count: number;
    inreview_count: number;
    partially_approved_count: number;
    approved_count: number;
    rejeccted_count: number;
    discharged_count: number;
    closed_count: number;
  }[];
  loading: boolean;
}

interface JobTitlesValuesTypes {
  jobTitles?: JobTitleTypes[];
  jobTitlesCount?: number;
  loading: boolean;
}

interface NetworkValuesTypes {
  network?: NetworkTypes;
  loading: boolean;
}

interface NetworksValuesTypes {
  networks?: NetworkTypes[];
  networksCount?: number;
  loading: boolean;
}

interface NetworkLevelsValuesTypes {
  networkLevels?: NetworkLevelTypes[];
  networkLevelsCount?: number;
  loading: boolean;
}

interface DefaultNetworksValuesTypes {
  defaultNetworks?: NetworkTypes[];
  loading: boolean;
}

interface DefaultNetworkValuesTypes {
  defaultNetwork?: NetworkTypes;
  loading: boolean;
}

interface DefaultPackagesValuesTypes {
  defaultPackages?: PackageTypes[];
  loading: boolean;
}

interface EditRequestsNetworkValuesTypes {
  requests?: EditRequestNetworkTypes[];
  requestsCount?: number;
  loading: boolean;
}

interface EditRequestNetworkValuesTypes {
  request?: EditRequestNetworkTypes;
  loading: boolean;
}

interface EditRequestsPackageValuesTypes {
  requests?: EditRequestPackageTypes[];
  requestsCount?: number;
  loading: boolean;
}


interface UsersValuesTypes {
  users?: UserTypes[];
  usersCount?: number;
  loading: boolean;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  limit?: number;
}

interface UserValuesTypes {
  user?: UserTypes;
  loading: boolean;
}


interface ConsumedChartValuesTypes {
  consumedChart?: {
    daily_balance: { consumed_balance: number; date: string }[];
    today_claims: number;
    today_consumed_balance: number;
  };
  loading: boolean;
}

interface UsagePrecentageValuesTypes {
  usagePrecentage?: {
    superAdmin: {
      account_manager_email: string;
      account_manager_name: string;
      account_manager_phone: string;
      address: string;
      all_members_count: number;
      assigned_to: string;
      available_balance: number;
      certificate: string;
      commercial_register_number: string;
      commercial_register_number_file: string;
      consumed_balance: number;
      coverage_document: string;
      covered_employees_count: number;
      covered_members_count: number;
      creation: string;
      docstatus: number;
      doctype: string;
      email: string;
      employees_count: number;
      holded_balance: number;
      iban: string;
      idx: number;
      is_active: number;
      logo: string;
      modified: string;
      modified_by: string;
      name: string;
      name1: string;
      owner: string;
      percentage_change_of_employees: number;
      phone: string;
      required_balance: number;
      size: string;
      status: string;
      subscription: string;
      tohold_balance: number;
      tour_status: string;
      uncovered_employees_count: number;
      uncovered_members_count: number;
      vat_number: string;
      vat_number_file: string;
    };
    usage: {
      total_count: number;
      total_usage_count: number;
      total_usage_percentage: number;
      today_claims_count: number;
    };
  };
  loading: boolean;
}

interface TransactionsValuesTypes {
  transactions?: TransactionTypes[];
  transactionsCount?: number;
  loading: boolean;
}

interface ApprovalsValuesTypes {
  approvals?: ApprovalTypes[];
  approvalsCount?: number;
  loading: boolean;
}

interface ApprovalValuesTypes {
  approval?: ApprovalTypes;
  loading: boolean;
}

interface PackagesValuesTypes {
  packages?: PackageTypes[];
  packagesCount?: number;
  loading: boolean;
}

interface PackageValuesTypes {
  package?: PackageTypes;
  loading: boolean;
}

interface BenefitValuesTypes {
  benefit?: BenefitTypes;
  loading: boolean;
}

export type {
  ApprovalsValuesTypes,
  ApprovalValuesTypes, AuthValuesTypes, BenefitValuesTypes, CitiesValuesTypes, ClaimsCountValuesTypes, ConsumedChartValuesTypes, CountriesValuesTypes, DefaultNetworksValuesTypes, DefaultNetworkValuesTypes, DefaultPackagesValuesTypes, EditRequestNetworkValuesTypes, EditRequestsNetworkValuesTypes, EditRequestsPackageValuesTypes, EditRequestsPackageValuesTypes, EmployeePackagesValuesTypes, EmployeesValuesTypes,
  EmployeeValuesTypes, GendersValuesTypes, JobTitlesValuesTypes, MostUsedClaimsValuesTypes, MostUsedProvidersValuesTypes, NetworkLevelsValuesTypes, NetworksValuesTypes, NetworkValuesTypes, PackagesValuesTypes,
  PackageValuesTypes, ProfileValuesTypes, ProviderBranchValuesTypes, ProvidersBranchesValuesTypes, ProviderTypesValuesTypes, RolesValuesTypes, RoleValuesTypes, TransactionsValuesTypes, UsagePrecentageValuesTypes, UsersValuesTypes, UserValuesTypes
};

