import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const PrimaryIconButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '4px',
  padding: '4px',
  border: '2px solid transparent',
  minWidth: 'auto !important',
  boxShadow: theme.shadows[1],
  '& svg': {
    fontSize: '20px',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
