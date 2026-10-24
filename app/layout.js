import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";

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
      <head>
        {/* Apply the saved language before first paint so Khmer users don't
            see an English flash; the client provider then takes over. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var l=localStorage.getItem('lang');if(l!=='en'&&l!=='km'){l='en';}document.documentElement.lang=l;document.documentElement.setAttribute('data-lang',l);}catch(e){}",
          }}
        />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
