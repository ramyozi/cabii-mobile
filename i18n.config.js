/**
 *  inpired by : https://www.youtube.com/watch?v=PPU29dyKoMA
 *  For Android don't forget after android build to add :
 *  android:supportsRtl="true" in AndroidManifest.xml file option
 *  resConfigs "en", "fr" in build.gradle file option
 */

import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from "expo-localization";

import fr from "./messages/fr.json";
import {getLocales} from "expo-localization";

const resources = {
    fr: { translation: fr },
};


const getLanguage = () => {
    const locales = getLocales();
    return locales.length > 0 ? locales[0].languageCode : 'fr';
};


i18next.use(initReactI18next)
    .init({
        resources: resources,
    lng: getLanguage(), // Localization.getLocales()[0]?.languageCode : alternative, will later judge which one to keep
    fallbackLng: 'fr',
    compatibilityJSON: 'v3',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18next;

