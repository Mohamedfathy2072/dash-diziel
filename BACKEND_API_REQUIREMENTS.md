# Backend API Requirements for Company Profits Dashboard

This document outlines the backend API endpoints required for the Company Profits dashboard to function properly.

## Required Endpoints

All endpoints should be prefixed with `/api/v1/admin/company-profits`

### 1. Get Company Profits
**Endpoint:** `GET /admin/company-profits`
**Query Parameters:**
- `period` (optional): 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year'
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string

**Response Structure:**
```json
{
  "data": {
    "total_revenues": number,
    "total_commission": number,
    "net_profit": number,
    "commission_rate": number,
    "total_trips": number,
    "avg_commission_per_trip": number,
    "avg_revenue_per_trip": number,
    "driver_profits": number
  }
}
```

### 2. Get Temporal Distribution
**Endpoint:** `GET /admin/company-profits/temporal-distribution`

**Response Structure:**
```json
{
  "data": [
    {
      "period": "today" | "yesterday" | "this_week" | "this_month" | "this_year",
      "total_revenue": number,
      "commission": number,
      "number_of_trips": number,
      "commission_percentage": number
    }
  ]
}
```

### 3. Get Earnings by Payment Method
**Endpoint:** `GET /admin/company-profits/by-payment-method`
**Query Parameters:**
- `period` (optional): string
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string

**Response Structure:**
```json
{
  "data": [
    {
      "payment_method": "Cash" | "Card" | "Wallet" | "Other",
      "amount": number,
      "number_of_trips": number
    }
  ]
}
```

### 4. Get Profits by City
**Endpoint:** `GET /admin/company-profits/by-city`
**Query Parameters:**
- `period` (optional): string
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string

**Response Structure:**
```json
{
  "data": [
    {
      "city": string,
      "total_revenue": number,
      "commission": number,
      "number_of_trips": number,
      "number_of_drivers": number,
      "commission_percentage": number
    }
  ]
}
```

### 5. Get Top Drivers by Commission
**Endpoint:** `GET /admin/company-profits/top-drivers`
**Query Parameters:**
- `limit` (optional): number (default: 10)
- `period` (optional): string
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string

**Response Structure:**
```json
{
  "data": [
    {
      "id": number,
      "name": string,
      "driver_name": string,
      "commission": number,
      "number_of_trips": number
    }
  ]
}
```

### 6. Get Growth Indicators
**Endpoint:** `GET /admin/company-profits/growth-indicators`
**Query Parameters:**
- `period` (optional): string

**Response Structure:**
```json
{
  "data": {
    "commission_growth": number,  // percentage
    "revenue_growth": number,     // percentage
    "trips_growth": number        // percentage
  }
}
```

### 7. Get Monthly Trend
**Endpoint:** `GET /admin/company-profits/monthly-trend`
**Query Parameters:**
- `months` (optional): number (default: 12)

**Response Structure:**
```json
{
  "data": {
    "labels": string[],  // Array of month labels (e.g., ["Feb 2025", "Mar 2025", ...])
    "commission": number[],
    "revenues": number[]
  }
}
```

### 8. Get Daily Trend
**Endpoint:** `GET /admin/company-profits/daily-trend`
**Query Parameters:**
- `days` (optional): number (default: 30)

**Response Structure:**
```json
{
  "data": {
    "labels": string[],  // Array of date labels (e.g., ["Dec 13", "Dec 14", ...])
    "commission": number[]
  }
}
```

## Notes

- All monetary values should be in IQD (Iraqi Dinar)
- All percentage values should be numbers (e.g., 5.5 for 5.5%)
- All endpoints should return data in the format: `{ "data": ... }`
- If no data is available, return empty arrays or null values
- All endpoints require admin authentication
