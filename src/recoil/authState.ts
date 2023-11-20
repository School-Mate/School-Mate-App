import { atom, selector } from "recoil";

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
};

export const authState = atom<AuthState>({
  key: "auth",
  default: {},
});
