import { Inter, Dancing_Script } from "next/font/google"
import "./globals.css"
import Sidebar from "./components/sidebar"
import { AuthProvider } from "./context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
})

export const metadata = {
  title: "HR & Payroll System",
  description: "Dashboard for HR & Payroll Management",
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className} ${dancingScript.variable} bg-slate-100`}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="w-full h-12 bg-white shadow-sm flex items-center justify-center border-b border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent font-dancing text-2xl font-bold italic tracking-widest">
                  DashBoard HR & Payroll System
                </div>
              </header>
              <main className="flex-1 overflow-auto p-0">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  )
}
