import { create } from "zustand";
import { type Language } from "./translations";

interface FarmerProfile {
  uid: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  acres: number;
  crops: string[];
  lang: string;
  aadhaar_last4: string;
  avatar: string;
}

export interface UserLocation {
  lat: number;
  lon: number;
  name: string;
  state: string;
}

interface AppState {
  profile: FarmerProfile | null;
  language: Language;
  theme: "light" | "dark";
  userLocation: UserLocation;
  crisisActive: boolean;
  sidebarOpen: boolean;
  setProfile: (p: FarmerProfile) => void;
  setLanguage: (l: Language) => void;
  setTheme: (t: "light" | "dark") => void;
  toggleTheme: () => void;
  setUserLocation: (loc: UserLocation) => void;
  setCrisisActive: (a: boolean) => void;
  setSidebarOpen: (o: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  language: "en",
  theme: "light",
  userLocation: {
    lat: 19.9975,
    lon: 73.7898,
    name: "Nashik, Maharashtra",
    state: "Maharashtra",
  },
  crisisActive: true,
  sidebarOpen: false,
  setProfile: (profile) => set({ profile }),
  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("khetisaathi-lang", language);
    }
    set({ language });
  },
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("khetisaathi-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      localStorage.setItem("khetisaathi-theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
    set({ theme: next });
  },
  setUserLocation: (userLocation) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("khetisaathi-location", JSON.stringify(userLocation));
    }
    set({ userLocation });
  },
  setCrisisActive: (crisisActive) => set({ crisisActive }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
