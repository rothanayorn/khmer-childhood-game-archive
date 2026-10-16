import "./globals.css";

export const metadata = {
  title: "Khmer Childhood Games",
  description:
    "An archive of Khmer childhood games, collected from the people who grew up playing them.",
};

// Without a viewport meta tag phones render the page at ~980px and shrink it —
// this tells browsers to use the actual device width (essential for mobile).
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
