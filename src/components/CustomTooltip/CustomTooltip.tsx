import { styled } from '@mui/material/styles';
import Tooltip, { type TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import * as React from 'react';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

const CustomTooltip = ({ title, placement, children }: { title: string; placement?: TooltipProps["placement"]; children: React.ReactElement }) => {
    return (
        <HtmlTooltip
            key={Math.random()}
            placement={placement || "top"}
            title={title}
        >
            {children}
        </HtmlTooltip>
    );
}

export default CustomTooltip