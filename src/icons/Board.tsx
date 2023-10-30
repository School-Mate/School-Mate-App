import { SvgXml } from "react-native-svg";

const BoardIcon = () => {
  return (
    <SvgXml
      xml={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.333344 3.83325C0.333344 1.90026 1.90035 0.333252 3.83334 0.333252H20.1667C22.0997 0.333252 23.6667 1.90026 23.6667 3.83325V7.33325L8.50001 7.33325H0.333344V3.83325Z" fill="black"/>
      <path d="M0.333344 9.66658V20.1666C0.333344 22.0996 1.90035 23.6666 3.83334 23.6666H7.33334V9.66659L0.333344 9.66658Z" fill="black"/>
      <path d="M9.66668 23.6666H20.1667C22.0997 23.6666 23.6667 22.0996 23.6667 20.1666V9.66659L9.66668 9.66659V23.6666Z" fill="black"/>
      </svg>
      `}
    />
  );
};

export default BoardIcon;
