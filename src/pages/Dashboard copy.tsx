// import Box from '@mui/material/Box';
// import { lazy, Suspense, useEffect } from "react";
// import { useDispatch } from "react-redux";
// // import LoadingBalanceDetailsSection from "../sections/BalanceDetailsSection/LoadingBalanceDetailsSection";
// // import LoadingClaimsCountSection from "../sections/ClaimsCountSection/LoadingClaimsCountSection";
// // import LoadingCounterCardsSection from "../sections/CounterCardsSection/LoadingCounterCardsSection";
// // import LoadingEmployeesBalanceDetailsSection from "../sections/EmployeesBalanceDetailsSection/LoadingEmployeesBalanceDetailsSection";
// // import LoadingMostClaimsSection from "../sections/MostClaimsSection/LoadingMostClaimsSection";
// // import LoadingMostUsedProvidersSection from "../sections/MostUsedProvidersSection/LoadingMostUsedProvidersSection";
// // import LoadingSubscriptionBalanceDetailsSection from "../sections/SubscriptionBalanceDetailsSection/LoadingSubscriptionBalanceDetailsSection";
// // import LoadingUsedMembersSection from "../sections/UsedMembersSection/LoadingUsedMembersSection";
// // import { getClaimsCount } from "../store/claimsCountSlice";
// import type { AppDispatch } from "../store/store";
// // const BalanceDetailsSection = lazy(() => import("../sections/BalanceDetailsSection/BalanceDetailsSection"));
// // const ClaimsCountSection = lazy(() => import("../sections/ClaimsCountSection/ClaimsCountSection"));
// // const CounterCardsSection = lazy(() => import("../sections/CounterCardsSection/CounterCardsSection"));
// // const EmployeesBalanceDetailsSection = lazy(() => import("../sections/EmployeesBalanceDetailsSection/EmployeesBalanceDetailsSection"));
// // const MostClaimsSection = lazy(() => import("../sections/MostClaimsSection/MostClaimsSection"));
// // const MostUsedProvidersSection = lazy(() => import("../sections/MostUsedProvidersSection/MostUsedProvidersSection"));
// // const SubscriptionBalanceDetailsSection = lazy(() => import("../sections/SubscriptionBalanceDetailsSection/SubscriptionBalanceDetailsSection"));
// // const UsedMembersSection = lazy(() => import("../sections/UsedMembersSection/UsedMembersSection"));

// const Dashboard = () => {
//   const dispatch = useDispatch<AppDispatch>()

//   // useEffect(() => {
//   //   dispatch(getClaimsCount());
//   // }, [dispatch]);

//   return (
//     <>
//       <Suspense fallback={<LoadingCounterCardsSection />}>
//         <CounterCardsSection />
//       </Suspense>
//       <Suspense fallback={<LoadingBalanceDetailsSection />}>
//         <BalanceDetailsSection />
//       </Suspense>
//       {/* <Box className={`grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-6 md:gap-5 sm:!gap-3`}>
//         <Suspense fallback={<LoadingSubscriptionBalanceDetailsSection />}>
//           <SubscriptionBalanc DetailsSection />
//         </Suspense>
//         <Suspense fallback={<LoadingUsedMembersSection />}>
//           <UsedMembersSection />
//         </Suspense>
//         <Suspense fallback={<LoadingEmployeesBalanceDetailsSection />}>
//           <EmployeesBalanceDetailsSection />
//         </Suspense>
//         <Suspense fallback={<LoadingMostClaimsSection />}>
//           <MostClaimsSection />
//         </Suspense>
//       </Box>
//       <Suspense fallback={<LoadingMostUsedProvidersSection />}>
//         <MostUsedProvidersSection />
//       </Suspense>
//       <Suspense fallback={<LoadingClaimsCountSection />}>
//         <ClaimsCountSection />
//       </Suspense> */}
//     </>
//   );
// };

// export default Dashboard;
