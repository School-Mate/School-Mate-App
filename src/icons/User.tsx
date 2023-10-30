import { SvgXml } from "react-native-svg";

const UserIcon = () => {
  return (
    <SvgXml
      xml={`<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0.166748C8.45617 0.166748 5.58333 3.03959 5.58333 6.58342C5.58333 10.1272 8.45617 13.0001 12 13.0001C15.5438 13.0001 18.4167 10.1272 18.4167 6.58342C18.4167 3.03959 15.5438 0.166748 12 0.166748Z" fill="#0A1A3A"/>
      <path d="M6.16666 15.3334C2.945 15.3334 0.333328 17.9451 0.333328 21.1667V24.6667C0.333328 25.3111 0.855663 25.8334 1.49999 25.8334H22.5C23.1443 25.8334 23.6667 25.3111 23.6667 24.6667V21.1667C23.6667 17.9451 21.055 15.3334 17.8333 15.3334H6.16666Z" fill="#0A1A3A"/>
      </svg>`}
    />
  );
};

export default UserIcon;
