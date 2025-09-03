    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        container: {
          center: true,
          padding: "2rem",
          screens: {
            "2xl": "1400px",
          },
        },
        extend: {
          colors: {
            bg: "hsl(0, 0%, 98%)",
            accent: "hsl(220, 90%, 50%)",
            primary: "hsl(20, 90%, 50%)",
            surface: "hsl(0, 0%, 100%)",
            "text-primary": "hsl(0, 0%, 15%)",
            "text-secondary": "hsl(0, 0%, 45%)",
          },
          borderRadius: {
            lg: "12px",
            md: "8px",
            sm: "4px",
            xl: "20px",
          },
          boxShadow: {
            card: "0 4px 16px hsla(0, 0%, 0%, 0.08)",
          },
          spacing: {
            lg: "16px",
            md: "8px",
            sm: "4px",
            xl: "24px",
          },
          fontSize: {
            body: ["1rem", { lineHeight: "1.75" }],
            caption: ["0.875rem", { color: "hsl(0, 0%, 45%)" }],
            display: ["1.875rem", { fontWeight: "bold" }],
            heading: ["1.25rem", { fontWeight: "600" }],
          },
          animation: {
            "fade-in": "fadeIn 200ms ease-out",
            "fade-out": "fadeOut 200ms ease-out",
          },
          keyframes: {
            fadeIn: {
              "0%": { opacity: "0" },
              "100%": { opacity: "1" },
            },
            fadeOut: {
              "0%": { opacity: "1" },
              "100%": { opacity: "0" },
            },
          },
        },
      },
      plugins: [],
    };
  