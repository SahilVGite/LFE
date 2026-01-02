import React from "react";
import Link from "next/link";

type SiteLogoProps = {
  className?: string;
  logoWhite?: boolean;
};

const SiteLogo = ({className="", logoWhite = false,}: SiteLogoProps) => {
  return (
    <Link href="/" className={`flex flex-col ${className}`}>
      {/* <span className={`text-xl md:text-3xl text-${fontColor} tracking-[0.4em] text-inter font-extrabold`}>
        LFE
      </span>
      {withTagline && (
        <span className="text-xs md:text-sm lg:text-lg font-semibold text-[#F69001]">
        Locate · Forecast · Execute
      </span>
      )} */}
      <img src="/LFE_Logo.png" alt="LFE" className={`w-full h-auto object-contain max-w-32 lg:max-w-45 ${logoWhite && 'invert brightness-0'}`} />
    </Link>
  );
};

export default SiteLogo;
