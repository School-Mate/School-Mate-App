import { SvgXml } from "react-native-svg";

const SectionIcon = () => {
  return (
    <SvgXml
      xml={`<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="25" fill="url(#paint0_linear_341_130)"/>
      <rect x="13" y="23" width="24" height="4" rx="2" fill="white"/>
      <rect x="23" y="37" width="24" height="4" rx="2" transform="rotate(-90 23 37)" fill="white"/>
      <defs>
      <linearGradient id="paint0_linear_341_130" x1="25" y1="0" x2="25" y2="50" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00E676"/>
      <stop offset="1" stop-color="#00E6E6"/>
      </linearGradient>
      </defs>
      </svg>      
      `}
    />
  );
};

export default SectionIcon;
