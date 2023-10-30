import { SvgXml } from "react-native-svg";

const DotIconEmpty = () => {
  return (
    <SvgXml
      xml={`<svg
          width="6"
          height="6"
          viewBox="0 0 6 6"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>`}
    />
  );
};
export default DotIconEmpty;
