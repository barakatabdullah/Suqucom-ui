import api from "@/config/axios";
import { i18n } from "@/main";
import {type Locale } from "vue-i18n";


export const toggleColorScheme = () => {
    const element = document.querySelector("html");
    element?.classList.toggle("dark-mode");
  };


export function setI18nLanguage(lang: Locale) {
    i18n.global.locale.value = lang as any
    if (typeof document !== 'undefined')
      {document.querySelector('html')?.setAttribute('lang', lang)
    if(lang.includes('ar') )
        document.querySelector('html')?.setAttribute('dir', 'rtl')
    if(lang.includes('en') )
        document.querySelector('html')?.setAttribute('dir', 'ltr')

      }

      localStorage.setItem("lang", lang);

    return lang
  }
  
  export async function loadLanguageAsync(lang: string): Promise<Locale> {
    // If the same language
    if (i18n.global.locale.value === lang)
      return setI18nLanguage(lang)
  
    // If the language was already loaded
    // if (loadedLanguages.includes(lang))
    //   return setI18nLanguage(lang)

    // i18n.global.setLocaleMessage(lang, messages)
    // loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  }




export async function getUser(){
    const {data} = await api.get('user')
      return data
}

export async function getAllPermissions(){
  const {data} = await api.get('permissions')
    return data
}

export async function getAllRoles(){
   const{data }= await api.get('roles')
    return data
}