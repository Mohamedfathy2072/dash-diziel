import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppStore } from '../../globals/appStore'

const BackDrop = () => {
    const backdrop = useAppStore((state) => state.backdrop)

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: "1000000" }}
            aria-label="Loading, please wait"
            open={backdrop}
        >
            <CircularProgress className="" />
        </Backdrop>
    )
}

export default BackDrop
