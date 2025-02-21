import { Config } from "../shared/config"

const jsonData = LoadResourceFile(GetCurrentResourceName(), `/locales/${Config.locale}.json`)
const Locale = JSON.parse(jsonData)

export function locale(index: string): string {
    return Locale[index]
}