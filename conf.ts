require('dotenv').config()
export const configPath = 'config.json'
export const configAsModule = './' + configPath
export type ngrokRegions = 'us' | 'eu' | 'au' | 'ap' | 'sa' | 'jp' | 'in'
export interface configStruct {
  "exposer": string,
  "subdomain": string,
  "ngrokSettings": {
    "authtoken": string,
    "region": ngrokRegions
  },
  "autoconnect": boolean,
  "tunnels": number[]
}
export const defaultConfig: configStruct = {
  "exposer": "ngrok",
  "subdomain": "scuritel",
  "ngrokSettings": {
    "authtoken": "",
    "region": "eu"
  },
  "autoconnect": true,
  "tunnels": []
}