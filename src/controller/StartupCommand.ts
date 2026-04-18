//
//  StartupCommand.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import { SimpleCommand, INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { UserProxy } from "../model/UserProxy";
import { RoleProxy } from "../model/RoleProxy";
import { RegisterCommand } from "./RegisterCommand";
import { ApplicationConstants } from "../ApplicationConstants";

export class StartupCommand extends SimpleCommand {

  execute(_: INotification) {
    this.facade.registerCommand(ApplicationConstants.REGISTER, () => new RegisterCommand());
    this.facade.registerCommand(ApplicationConstants.UNREGISTER, () => new RegisterCommand());

    this.facade.registerProxy(new UserProxy());
    this.facade.registerProxy(new RoleProxy());
  }

}
