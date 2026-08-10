import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ShareAndDiscover } from "@/components/landing/ShareAndDiscover";
import { Contributors } from "@/components/landing/Contributors";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ShareAndDiscover />
        <Contributors />
      </main>
      <Footer />
    </>
  );
}
