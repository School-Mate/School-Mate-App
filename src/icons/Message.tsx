import { SvgXml } from "react-native-svg";

const MessageIcon = () => {
  return (
    <SvgXml
      xml={`<svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.868667 1.90133C1.50826 1.05134 2.52514 0.5 3.66663 0.5H22.3333C23.4748 0.5 24.4917 1.05134 25.1313 1.90132L13 10.7241L0.868667 1.90133Z" fill="#09D969"/>
      <path d="M0.166626 4.27591V18C0.166626 19.9277 1.73896 21.5 3.66663 21.5H22.3333C24.261 21.5 25.8333 19.9277 25.8333 18V4.27591L14.3724 12.6111C13.5542 13.2062 12.4457 13.2062 11.6276 12.6111L0.166626 4.27591Z" fill="#09D969"/>
      </svg>`}
    />
  );
};

export default MessageIcon;
