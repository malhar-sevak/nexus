import "./globals.css";
import PageTransition from "../components/PageTransition";

export const metadata = {
  title: "Nexus — An AI that connects you to the AI world",
  description: "Your daily feed of AI and ML news, curated by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}