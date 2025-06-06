import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { CallToAction } from "@/components/landing/cta";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={null} />
      <main className="flex-grow pt-16">
        <Hero />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}