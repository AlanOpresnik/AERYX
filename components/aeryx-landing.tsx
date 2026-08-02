
import { Hero } from "./Hero/Hero";
import { Mark } from "./ui/Mark";
import { Brand } from "./Brand/Brand";
import { Categories } from "./Categories/Categories";
import { Shop } from "./Shop/Shop";
import { Newsletter } from "./NewsLetter/NewsLetter";
import { Footer } from "./Footer/Footer";
import { Benefits } from "./Benefits/Benefits";

export function AeryxLanding() {
  return (
    <main>
      <Hero />
      <Benefits />
      <Shop />
      <Categories />
      <Brand />
      <Newsletter />
    </main>
  );
}
