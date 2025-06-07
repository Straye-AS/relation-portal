import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Slider from "react-infinite-logo-slider";
import Image from "next/image";

export function Logos() {
  return (
    <section className="py-20 text-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl mb-4">
          Join the best companies in the world
        </h2> 
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          We work with the best companies in the world to help them build their products.
        </p>
        <Slider
            width="150px"
            duration={10}
            pauseOnHover={true}
            blurBorders={false}
            blurBorderColor={'#fff'}
        >
            <Slider.Slide>
                <Image src="/supabase.png" alt="any" className='w-20' width={100} height={100} />
            </Slider.Slide>
            <Slider.Slide>
                    <Image src="/stripe2.webp" alt="any2" className='w-20' width={100} height={100} />
            </Slider.Slide>
            <Slider.Slide>
                <Image src="/next.png" alt="any3" className='w-20 dark:invert' width={100} height={100} />
            </Slider.Slide>
            <Slider.Slide>
                <Image src="/open-ai.png" alt="any3" className='w-20 dark:invert' width={100} height={100} />
            </Slider.Slide>
            
        </Slider>
      </div>
    </section>
  );
}