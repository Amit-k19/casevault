import "./globals.css";

export const metadata = {
  title: "CaseVault — Case Competition Slide Showcase",
  description: "Browse and share case competition slides.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink min-h-screen">{children}</body>
    </html>
  );
}
