import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import ChatbotClientMount from "@/components/chatbot-client-mount";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({subsets: ["latin"]});


export const metadata = {
  title: "welth",
  description: "AI based advanced finance tracking app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={inter.className}
      >
        {/*header*/}
        <Header />
        <main className="min-h-screen"> 
           {children}
        </main>
  {/* Floating chat widget */}
  <ChatbotClientMount />
         <Toaster richColors/>
        {/*footer*/}
        <footer className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Welth</h3>
                <p className="text-blue-100 mb-4 max-w-md">
                  Your all-in-one solution for financial success. Master your money with AI-powered insights and seamless tracking.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-blue-500 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-blue-100 mb-4 md:mb-0">
                © 2025 Welth. All rights reserved.
              </div>
              <div className="text-blue-200 text-sm">
                Made with ❤️ by <a href="https://www.jnaneshreddy.social/" target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-blue-100 transition-colors">Jnanesh Reddy</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  </ClerkProvider>
  );
}
