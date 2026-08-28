import "./globals.css";

export const metadata = {
  title: "Khmer Childhood Games",
  description:
    "An archive of Khmer childhood games, collected from the people who grew up playing them.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
