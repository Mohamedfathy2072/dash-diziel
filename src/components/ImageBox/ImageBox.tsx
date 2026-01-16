import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { ImageBoxTypes } from "../../types/components";

const ImageBox = ({
    className,
    lazy,
    src,
    alt,
    children,
    variant,
}: ImageBoxTypes) => {
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!lazy) {
            const img = new Image();
            img.src = src;
            img.onload = () => setLoading(false);
            img.onerror = () => {
                setLoading(false);
                setHasError(true);
            };
            setLoading(true);
        } else {
            setLoading(true);
        }
    }, [lazy, src]);

    return (
        <Box
            className={`${className} ${!lazy && "bg-cover bg-center bg-no-repeat"
                } relative flex justify-center items-center`}
            sx={{
                backgroundImage: `${!lazy && `url('${src}')`}`,
                "& img":
                    variant === "product"
                        ? {
                            position: "absolute",
                            top: "0",
                            left: "50%",
                            transform: "translateX(-50%)",
                            borderRadius: "8px",
                        }
                        : {},
            }}
        >
            {lazy && !hasError && (
                <>
                    {loading && (
                        <Box
                            className={`w-full h-full flex justify-center items-center absolute left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%] z-[-1]`}
                        >
                            <CircularProgress
                                className={`w-[35px] h-[35px] md:!w-[30px] md:!h-[30px] sm:!w-[25px] sm:!h-[25px]`}
                                sx={{
                                    "&>svg": {
                                        color: (theme) => theme.palette.primary.main,
                                    },
                                }}
                            />
                        </Box>
                    )}
                    <LazyLoadImage
                        src={src}
                        alt={alt || "Jeeteak"}
                        className="w-full h-full object-cover"
                        beforeLoad={() => setLoading(true)}
                        afterLoad={() => setLoading(false)}
                        fetchPriority="high"
                        onError={() => {
                            setLoading(false);
                            setHasError(true);
                        }}
                    />
                </>
            )}
            {hasError && (
                <Typography
                    variant="body1"
                    className={`text-center !text-primary_300`}
                >
                </Typography>
            )}
            {children}
        </Box>
    );
};

export default ImageBox;
