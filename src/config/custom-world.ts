import { setWorldConstructor, World } from '@cucumber/cucumber';
import { APIRequestContext, BrowserContext, Page, PlaywrightTestOptions } from '@playwright/test';
import * as messages from '@cucumber/cucumber';
 
export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}
 
export interface ICustomWorld extends World {
  feature?: any;
  context?: BrowserContext;
  page?: Page;
  testName?: string;
  startTime?: Date;
  Server?: APIRequestContext;
  playwrightOptions?: PlaywrightTestOptions;
  store: { [key: string]: any }; // Add a store for dynamic data
}
 
export class CustomWorld extends World implements ICustomWorld {
  constructor(options: messages.IWorldOptions) {
	super(options);
	this.store = {}; // Initialize the store as an empty object
  }
  store: { [key: string]: any };
 
  // Store dynamic data (key-value pair)
  set(key: string, value: any) {
	this.store[key] = value;
  }
 
  // Retrieve stored data by key
  get<T = any>(key: string): T {
	return this.store[key];
  }
 
  // Push to an array in the store (auto creates array if not exists)
  pushTo(key: string, value: any) {
	if (!Array.isArray(this.store[key])) {
  	this.store[key] = [];
	}
	this.store[key].push(value);
  }
 
  // Optional: Reset the store (if needed for a clean slate)
  resetStore() {
	this.store = {};
  }
 
  // Existing properties
  feature?: any;
  context?: BrowserContext | undefined;
  page?: Page | undefined;
  testName?: string | undefined;
  startTime?: Date | undefined;
  Server?: APIRequestContext | undefined;
  playwrightOptions?: PlaywrightTestOptions | undefined;
  debug: false | undefined;
}
 
// Set the CustomWorld constructor to use the modified class
setWorldConstructor(CustomWorld);
