import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // EU Theme Colors
        "eu-background": "hsl(var(--eu-background))",
        "eu-foreground": "hsl(var(--eu-foreground))",
        "eu-card": "hsl(var(--eu-card))",
        "eu-card-foreground": "hsl(var(--eu-card-foreground))",
        "eu-primary": "hsl(var(--eu-primary))",
        "eu-primary-foreground": "hsl(var(--eu-primary-foreground))",
        "eu-secondary": "hsl(var(--eu-secondary))",
        "eu-secondary-foreground": "hsl(var(--eu-secondary-foreground))",
        "eu-accent": "hsl(var(--eu-accent))",
        "eu-muted": "hsl(var(--eu-muted))",
        "eu-border": "hsl(var(--eu-border))",
        // NATO Theme Colors
        "nato-background": "hsl(var(--nato-background))",
        "nato-foreground": "hsl(var(--nato-foreground))",
        "nato-primary": "hsl(var(--nato-primary))",
        "nato-secondary": "hsl(var(--nato-secondary))",
        "nato-accent": "hsl(var(--nato-accent))",
      },
      backgroundImage: {
        'gradient-soviet': 'var(--gradient-soviet)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-eu': 'var(--gradient-eu)',
        'gradient-eu-gold': 'var(--gradient-eu-gold)',
        'gradient-nato': 'var(--gradient-nato)',
      },
      boxShadow: {
        'soviet': 'var(--shadow-soviet)',
        'eu': 'var(--shadow-eu)',
      },
      borderRadius: {
        lg: "0rem",
        md: "0rem",
        sm: "0rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
