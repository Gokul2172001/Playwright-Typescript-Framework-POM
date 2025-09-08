import { World } from "@cucumber/cucumber";
import { Page } from "play";

export interface customWorld extends World {
  debug: boolean;
  page?: Page;
  feature?: Message.pickle;
}
