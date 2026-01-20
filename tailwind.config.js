/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: { max: "560px" },
        sm: { max: "768px" },
        md: { max: "992px" },
        lg: { max: "1200px" },
        xl: { max: "1440px" },
        "2xl": { max: "1560px" },
      },
      colors: {
        primary_100: "var(--primary_100)",
        primary_200: "var(--primary_200)",
        primary_300: "var(--primary_300)",
        primary_400: "var(--primary_400)",
        primary_500: "var(--primary_500)",
        primary_600: "var(--primary_600)",
        primary_700: "var(--primary_700)",
        primary_800: "var(--primary_800)",
        primary_900: "var(--primary_900)",

        secondary_100: "var(--secondary_100)",
        secondary_200: "var(--secondary_200)",
        secondary_300: "var(--secondary_300)",
        secondary_400: "var(--secondary_400)",
        secondary_500: "var(--secondary_500)",
        secondary_600: "var(--secondary_600)",
        secondary_700: "var(--secondary_700)",
        secondary_800: "var(--secondary_800)",
        secondary_900: "var(--secondary_900)",

        neutral_white: "var(--neutral_white)",
        neutral_100: "var(--neutral_100)",
        neutral_200: "var(--neutral_200)",
        neutral_300: "var(--neutral_300)",
        neutral_400: "var(--neutral_400)",
        neutral_500: "var(--neutral_500)",
        neutral_600: "var(--neutral_600)",
        neutral_700: "var(--neutral_700)",
        neutral_800: "var(--neutral_800)",
        neutral_900: "var(--neutral_900)",
        neutral_dark: "var(--neutral_dark)",

        success_100: "var(--success_100)",
        success_200: "var(--success_200)",

        warning_100: "var(--warning_100)",
        warning_dark: "var(--warning_dark)",

        error_100: "var(--error_100)",
        error_dark: "var(--error_dark)",

        other: "var(--other)",

        primary: "#003366",
        secondary: "#FFA500",
        primary_bg: "#F3F5F9",
        counter_card_red: "#ff2828",
        counter_card_red_light: "#fff0f0",
        counter_card_cyan: "#2ad2c5",
        counter_card_cyan_light: "#eafbf9",
        counter_card_purple: "#5a46e6",
        counter_card_purple_light: "#efedfd",
        counter_card_green: "#1ec940",
        counter_card_green_light: "#f0fdf2",
        table_head: "#fafafa",
        profile_employees_counter: "#8280ff",
        profile_employees_counter_light: "#d2f6f3",
        profile_employees_counter_gray: "#fafafa",
        profile_employees_counter_text_gray: "#636466",
        Diziel_gray: "#82808D",
        text_label_border: "#EEEEEE",
      },
      boxShadow: {
        primary:
          "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      backgroundImage: {
        gradient_primary: "linear-gradient(90deg,#003366 20% ,#FFA500 100%)",
        gradient_primary_reverse:
          "linear-gradient(90deg,#FFA500 20% ,#003366 100%)",
      },
    },
  },
  plugins: [],
};
