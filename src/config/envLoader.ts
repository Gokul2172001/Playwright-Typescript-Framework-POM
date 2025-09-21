
import { ENV } from './env';
import configJson from './../data/environment/environment.json';
 
type EnvKey = keyof typeof configJson;
 
if (!configJson[ENV as EnvKey]) {
  throw new Error(`No environment config found for ENV="${ENV}"`);
}
 
export const CONFIG = configJson[ENV as EnvKey];
