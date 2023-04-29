import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        reflex: {
          '50': '#f2f8fd',
          '100': '#e4f0fa',
          '200': '#c3e1f4',
          '300': '#8ec9eb',
          '400': '#46a7dc',
          '500': '#2b93cc',
          '600': '#1c75ad',
          '700': '#185e8c',
          '800': '#185074',
          '900': '#194461',
          '950': '#112b40',
        },
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
