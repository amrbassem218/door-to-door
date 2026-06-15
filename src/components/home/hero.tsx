import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative sm:h-150 h-100 overflow-hidden">
      <Image
        src={"/hero.webp"}
        alt="hero image"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/0 to-transparent"></div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
        <h1 className="text-5xl lg:text-8xl font-bold text-white text-center leading-none flex flex-col">
          <span className="">
            Local <span className="">the</span>{" "}
          </span>

          <span>
            <span className="relative inline-block">
              <span
                className="absolute inset-0 -left-2 -right-2 -top-1 -bottom-1 bg-yellow-300/80 -rotate-7 rounded-sm"
                aria-hidden="true"
              />
              <span className="relative">right</span>
            </span>{" "}
            <span className="">way</span>
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
