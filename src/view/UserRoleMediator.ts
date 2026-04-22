//
//  UserRoleMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import { Mediator } from "@puremvc/puremvc-typescript-multicore-framework";
import { RoleProxy } from "../model/RoleProxy";
import { IUserRole } from "./components/UserRole";

export class UserRoleMediator extends Mediator {

  public static NAME = "UserRoleMediator";

  private roleProxy!: RoleProxy;

  constructor(component: any) {
    super(UserRoleMediator.NAME, component);
  }

  public async onRegister() {
    this.delegate.findAllRoles = () => this.findAllRoles();
    this.delegate.findRolesByUserId = id => this.findRolesByUserId(id)

    this.roleProxy = this.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy;
  }

  private async findAllRoles() {
    try {
      return await this.roleProxy.findAllRoles();
    } catch(error) {
      console.log(error);
    }
  }

  private async findRolesByUserId(id: number) {
    try {
      return await this.roleProxy.findRolesById(id);
    } catch(error) {
      console.log(error);
    }
  }

  public get delegate() : IUserRole {
    return this.viewComponent
  }

}
