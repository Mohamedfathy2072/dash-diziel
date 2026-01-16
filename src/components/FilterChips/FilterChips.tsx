import { Box, Chip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useQueries from '../../hooks/useQueries'
import type { FilterChipsTypes } from '../../types/components'

const FilterChips = ({ variant, onClose }: FilterChipsTypes) => {
  const { t } = useTranslation("components/filter_chips")
  const { handleGetQueries } = useQueries()
  const queries = handleGetQueries()

  return (
    <Box className="flex justify-stretch items-center flex-wrap gap-3">
      {Object.entries(queries).map(([key, value]) => {
        if (value && key !== "limit" && key !== "page") {
          return (
            <Chip
              key={key}
              color="primary"
              variant='outlined'
              className={`custom_chip`}
              label={
                <Typography variant='subtitle2' className='!font-[600]'><span className='!font-[400] !text-black'>{t(`filter_${variant}_form.${key}`)} : </span> {` ${t(`filter_${variant}_form.${value?.toLowerCase()}`, { defaultValue: `${value}` })}`}</Typography>
              }
              onDelete={() => onClose(key)}
            />
          )
        }
      })}
    </Box>
  )
}

export default FilterChips
