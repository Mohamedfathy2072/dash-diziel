import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import usePagination from '../../hooks/usePagination';
import ChevronLeftIcon from '../../icons/ChevronLeftIcon';
import ChevronRightIcon from '../../icons/ChevronRightIcon';
import type { PrimaryPaginationTypes } from '../../types/components';

const PrimaryPagination = ({ count, loading, variant }: PrimaryPaginationTypes) => {
    const { handleChange, page, limit } = usePagination(variant)

    return !loading && count && count > (+(limit || "10") || 10) ? (
        <Box className={`flex justify-center items-center`}>
            <Pagination
                count={Math.ceil(count / ((+limit) || 10))} variant="outlined"
                shape="rounded"
                page={page}
                onChange={handleChange}
                renderItem={(item) => (
                    <PaginationItem
                        slots={{
                            previous: ChevronLeftIcon,
                            next: ChevronRightIcon,
                        }}
                        {...item}
                    />
                )} />
        </Box>
    ) : (<></>)
}

export default PrimaryPagination
