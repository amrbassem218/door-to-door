import * as React from "react";
import SearchBar from "@/components/ui/searchBar";
import Link from "next/link";
interface IHeroProps {}

const Hero: React.FunctionComponent<IHeroProps> = (props) => {
  const suggestedKeywords = ["tomatoes", "olives", "lettuce", "onion"];
  return (
    <div className="">
      <div className="relative sm:h-150 h-100 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/door2door_vid.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay - darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/0 to-transparent"></div>

        <div className=" z-10 flex items-center justify-center lg:mx-20 ">
          <div className="absolute left-0 sm:bottom-35 bottom-10 w-150 max-w-full px-5">
            <h1 className="lg:text-5xl text-2xl font-bold mb-4 text-white ">
              From Egyptian Fields to the World's Markets
            </h1>
            <div className="space-y-3">
              <SearchBar styles="w-full h-12" />
              <div className="flex gap-2">
                {suggestedKeywords.map((word) => (
                  <Link
                    key={word}
                    className="p-3 h-5 border-1 border-white flex items-center justify-center rounded-md text-white hover:bg-background hover:text-black cursor-pointer transition-all"
                    href={`/search/${word}`}
                  >
                    <p className="">{word}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
