import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";

// --- Hero banner background URLs (edit these three) ---
const HERO_BACK_TO_SCHOOL_BG =
  "https://studentcomputers.co.uk/cdn/shop/files/1200x628_back_to_school_laptops.png?v=1692717605";
const HERO_RTX_4090_BG =
  "https://bizweb.dktcdn.net/100/329/122/files/hieu-suat-vuot-troi-cua-rtx-4090.jpg?v=1673115180215";
const HERO_GAMING_GEAR_BG =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85";
// -------------------------------------------------------

const HeroSection = () => {
  return (
    <section className="flex w-full flex-col gap-5 lg:h-110 lg:flex-row">
      {/* Main Banner */}
      <div className="group relative flex min-h-80 flex-col justify-center overflow-hidden rounded-3xl lg:min-h-0 lg:w-[62%] shadow-2xl shadow-sky-100/50">
        <Image
          src={HERO_BACK_TO_SCHOOL_BG}
          alt="Back to School"
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent lg:from-white/90 lg:via-white/60" />
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 p-8 text-center lg:items-start lg:gap-8 lg:p-16 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-1.5 text-xs font-black tracking-widest text-blue-600 uppercase ring-1 ring-blue-600/20">
            <Flame className="h-3.5 w-3.5 animate-pulse text-orange-500 fill-orange-500" />
            Seasonal Deals
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 lg:text-6xl xl:text-7xl">
              BACK TO <span className="text-blue-600">SCHOOL</span>
            </h2>
            <p className="text-lg font-medium text-slate-600 lg:text-2xl max-w-md leading-relaxed">
              Build PC thông minh - Nhận ngay bộ quà tặng Gaming cực đỉnh.
            </p>
          </div>

          <Button
            className={cn(
              "group/btn relative h-12 w-48 overflow-hidden rounded-2xl bg-blue-600 px-8 text-base font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 lg:h-14 lg:w-56 lg:text-lg",
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Săn Deal Ngay
              <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>

      {/* Side Banners */}
      <div className="flex flex-col gap-5 lg:w-[38%]">
        {/* RTX 4090 */}
        <div className="group relative flex min-h-40 flex-col justify-center overflow-hidden rounded-3xl px-8 text-white shadow-xl shadow-slate-200/50 lg:min-h-0 lg:flex-1 lg:px-10">
          <Image
            src={HERO_RTX_4090_BG}
            alt="RTX 4090"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent transition-opacity group-hover:opacity-80" />
          
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Next-Gen Performance</span>
            <h3 className="text-2xl font-black lg:text-3xl">RTX 4090 <span className="text-blue-500">Series</span></h3>
            <p className="text-sm font-medium text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sức mạnh tối thượng cho Game thủ</p>
          </div>
        </div>

        {/* Gaming Gear */}
        <div className="group relative flex min-h-40 flex-col justify-center overflow-hidden rounded-3xl px-8 lg:min-h-0 lg:flex-1 lg:px-10">
          <Image
            src={HERO_GAMING_GEAR_BG}
            alt="Gaming Gear"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent transition-all group-hover:backdrop-blur-[2px]" />
          
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Pro Essentials</span>
            <h3 className="text-2xl font-black text-slate-900 lg:text-3xl">Gaming <span className="text-blue-600">Gear</span></h3>
            <p className="text-sm font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Chinh phục mọi đấu trường</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
