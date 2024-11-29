import i18n from 'i18next'
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: "en",
        returnObjects: true,
        lng:"en",
        resources:{
            en: {
                translation:{
                    sign_in: "Sign In"
                }
            },
            hi:{
                translation: {
                    sign_in: "साइन इन"
                }
            }
        }
    })