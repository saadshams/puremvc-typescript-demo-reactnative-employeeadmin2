//
//  ApplicationFacade.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { StartupCommand } from "./controller/StartupCommand";
import { ApplicationConstants } from "./ApplicationConstants";

export class ApplicationFacade extends Facade {

  public constructor(key: string) {
    super(key);
  }

  protected initializeController() {
    super.initializeController();
    this.registerCommand(ApplicationConstants.STARTUP, () => new StartupCommand());
  }

  public static getInstance(): ApplicationFacade {
    return Facade.getInstance(ApplicationConstants.KEY, key => new ApplicationFacade(key)) as ApplicationFacade;
  }

  public startup() {
    this.sendNotification(ApplicationConstants.STARTUP);
  }

  public register(component: any, type: string) {
    this.sendNotification(ApplicationConstants.REGISTER, component, type);
  }

  public unregister(component: any, type: string) {
    this.sendNotification(ApplicationConstants.UNREGISTER, component, type);
  }
}
