import "./globals.css";

export const metadata = {
  title: "dev-intezar.netlify.app",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-[#ee2389]">{children}</body>
    </html>
  );
}
