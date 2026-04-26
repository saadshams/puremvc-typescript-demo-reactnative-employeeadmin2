//
//  UserRoleMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Mediator} from "@puremvc/puremvc-typescript-multicore-framework";
import {RoleProxy} from "../model/RoleProxy";
import {IUserRole} from "./components/UserRole";

export class UserRoleMediator extends Mediator {

  public static NAME = "UserRoleMediator";

  private roleProxy!: RoleProxy;

  constructor(delegate: any) {
    super(UserRoleMediator.NAME, delegate);
  }

  public async onRegister() {
    this.delegate.findAllRoles = (signal: AbortSignal) => this.findAllRoles(signal);
    this.delegate.findRolesByUserId = (id: number, signal: AbortSignal) => this.findRolesByUserId(id, signal)

    this.roleProxy = this.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy;
  }

  private async findAllRoles(signal: AbortSignal) {
    return await this.roleProxy.findAllRoles(signal);
  }

  private async findRolesByUserId(id: number, signal: AbortSignal) {
    return await this.roleProxy.findRolesById(id, signal);
  }

  public get delegate(): IUserRole {
    return this.viewComponent
  }

}
