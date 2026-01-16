import Box from '@mui/material/Box';
import { Suspense } from "react";
import AuthSide from '../../components/AuthSide/AuthSide';
import LangSwitch from '../../components/LangSwitch/LangSwitch';
import Forms from "../../forms/Forms";
import { PrimaryBox } from '../../mui/boxes/PrimaryBox';
import { PrimaryContainer } from '../../mui/containers/PrimaryContainer';
import type { AuthenticationSectionTypes } from "../../types/sections";

const AuthenticationSection = ({ type }: AuthenticationSectionTypes) => {
  return (
    <Box
      className={`grid justify-stretch items-center ${type === "updatePassword" ? "" : "grid-cols-[30%,1fr] md:!grid-cols-1"
        } min-h-screen`}
    >
      <Suspense fallback={<div className={`bg-primary`}></div>}>
        {type !== "updatePassword" && <AuthSide />}
      </Suspense>
      <PrimaryBox className={`!grid justify-stretch items-center`}>
        <PrimaryContainer
          className={`!grid justify-stretch items-center !m-auto !w-[50%] lg:w-[75%] md:w-[85%] sm:!w-full`}
        >
          <LangSwitch />
          <Forms type={type} />
        </PrimaryContainer>
      </PrimaryBox>
    </Box>
  );
};

export default AuthenticationSection;
