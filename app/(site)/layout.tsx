import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BoxTransitionProvider from "@/app/components/BoxTransition";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BoxTransitionProvider>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </BoxTransitionProvider>
  );
}
