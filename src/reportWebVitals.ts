import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

type Metric = {
    name: string;
    value: number;
};

export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onCLS(onPerfEntry);
        onLCP(onPerfEntry);
        onFCP(onPerfEntry);
        onINP(onPerfEntry);
        onTTFB(onPerfEntry);
    }
};
