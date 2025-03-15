import { adminApi, api } from "@/config/axios";
import { i18n } from "@/main";
import { type Locale } from "vue-i18n";

export const toggleColorScheme = () => {
  const settingsStore = useSettingsStore();
  const element = document.querySelector("html");
  element?.classList.toggle("dark");
  settingsStore.settings.theme = element?.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("theme", settingsStore.settings.theme);
};

export const initTheme = () => {
  const settingsStore = useSettingsStore();
  const element = document.querySelector("html");
  if (settingsStore.settings.theme === "dark") {
    element?.classList.add("dark");
  }
};

export function setI18nLanguage(lang: Locale) {
  const settingsStore = useSettingsStore();

  i18n.global.locale.value = lang as any;
  if (typeof document !== "undefined") {
    document.querySelector("html")?.setAttribute("lang", lang);
    if (lang.includes("ar"))
      document.querySelector("html")?.setAttribute("dir", "rtl");
    if (lang.includes("en"))
      document.querySelector("html")?.setAttribute("dir", "ltr");
  }

  settingsStore.settings.lang = lang;
  localStorage.setItem("lang", lang);

  return lang;
}

export async function changeLanguage(lang: string) {
  setI18nLanguage(lang);
  location.reload();
}

export async function getAdmin() {
  const adminStore = useAdminStore();

  const { data } = await adminApi.get<Admin>("/");
  adminStore.admin.name = data.name;
  adminStore.admin.avatar = data.avatar;

  localStorage.setItem("adminName", data.name);
  localStorage.setItem("adminAvatar", data.avatar);

  return data;
}

export async function getUser() {
  const { data } = await api.get("user");
  return data;
}

export async function getAllPermissions() {
  const { data } = await api.get("permissions");
  return data;
}

export async function getAllRoles() {
  const { data } = await adminApi.get("roles");
  return data;
}
