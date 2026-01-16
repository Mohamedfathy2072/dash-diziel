import { Container, styled } from '@mui/material';

export const PrimaryBox = styled(Container)(({ theme }) => ({
  padding: '0px !important',
  margin: '0px',
  maxWidth: '100% !important',
  height: '100%',
  paddingTop: '30px !important',
  paddingBottom: '30px !important',
  [theme.breakpoints.down('lg')]: {
    paddingTop: '25px !important',
    paddingBottom: '25px !important',
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: '20px  !important',
    paddingBottom: '20px !important',
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '15px !important',
    paddingBottom: '15px !important',
  },
  [theme.breakpoints.down('xs')]: {
    paddingTop: '10px !important',
    paddingBottom: '10px !important',
  },
}));
