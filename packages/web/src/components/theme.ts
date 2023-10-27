import { extendTheme } from "@chakra-ui/react";

const blandColor = "#3182CE";

const customTheme = extendTheme({
    colors: {
        brand: {
            50: "#DBEDFF",
            100: "#B1D3F3",
            200: "#86B8E7",
            300: "#5C9DDB",
            400: "#4790D5",
            500: "#3182CE",
            600: "#2D76BB",
            700: "#296BAA",
            800: "#25619B",
            900: "#22588D",
        },
        primary: {
            50: "#EBF6FA",
            100: "#B9D5E0",
            200: "#87B3C5",
            300: "#5591AB",
            400: "#3C809E",
            500: "#226F90",
            600: "#1A5A74",
            700: "#12445A",
            800: "#0B2F40",
            900: "#051B26",
        },
        secondary: {
            50: "#94A9EE",
            100: "#89A0EC",
            200: "#7791E9",
            300: "#6582E6",
            400: "#5373E3",
            500: "#4164E0",
            600: "#3B5BCC",
            700: "#3653B9",
            800: "#314BA8",
            900: "#2D4499",
        },
        tertiary: {
            50: "#F6FCFF",
            100: "#F1FBFF",
            200: "#ECF9FF",
            300: "#E2F6FF",
            400: "#D8F3FF",
            500: "#CEF0FF",
            600: "#BBDAE8",
            700: "#AAC6D3",
            800: "#9BB4C0",
            900: "#8DA4AF",
        },
        accent: {
            50: "#F7E2F6",
            100: "#F5DCF4",
            200: "#F1CDEF",
            300: "#ECBDEA",
            400: "#E29EE0",
            500: "#D87FD6",
            600: "#D370D1",
            700: "#CE60CC",
            800: "#C543C3",
            900: "#BC26B9",
        },
    },
});

export default customTheme;
