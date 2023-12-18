import { atom, selector } from "recoil";

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  verfiyed?: boolean;
};

export const authState = atom<AuthState>({
  key: "auth",
  default: {},
});
