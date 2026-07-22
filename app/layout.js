import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import { FinanceProvider } from "../context/finance-context";
import { AuthProvider } from "../context/auth-context";
import { UIProvider } from "../context/ui-context";

export const metadata = {
  title: "GastoFobia",
  description: "Control de gastos personales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <UIProvider>
          <AuthProvider>
            <FinanceProvider>{children}</FinanceProvider>
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
