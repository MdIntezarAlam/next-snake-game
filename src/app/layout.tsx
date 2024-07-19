import "./globals.css";
import ClientOnlyComponent from "./_components/ClientOnlyComponent";

export const metadata = {
  title: "Create Next App",
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
      <body>
        {children}
        <ClientOnlyComponent /> {/* Render the client-side component */}
      </body>
    </html>
  );
}
