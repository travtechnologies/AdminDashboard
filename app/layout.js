import "./globals.css";
// Main Layout file is desgined here ↙️ 
import Layout from "./components/Layout";

// app/layout.js
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard created with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-black">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
