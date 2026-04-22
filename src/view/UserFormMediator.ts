//
//  UserFormMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import { Mediator } from "@puremvc/puremvc-typescript-multicore-framework";
import { UserProxy } from "../model/UserProxy";
import { IUserForm } from "./components/UserForm";
import { User } from "../model/valueObject/User";

export class UserFormMediator extends Mediator {

  public static NAME = "UserFormMediator";

  private userProxy!: UserProxy;

  constructor(delegate: any) {
    super(UserFormMediator.NAME, delegate);
  }

  public async onRegister() {
    this.delegate.findAllDepartments = () => this.findAllDepartments();
    this.delegate.findUserById = id => this.findUserById(id);
    this.delegate.save = user => this.save(user);
    this.delegate.update = user => this.update(user);

    this.userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
  }

  private async findAllDepartments() {
    try {
      return await this.userProxy.findAllDepartments();
    } catch (error) {
      console.log(error);
    }
  }

  private async findUserById(id: number) {
    try {
     return await this.userProxy.findUserById(id);
    } catch (error) {
      console.log(error);
    }
  }

  private async save(user: User) {
    try {
      await this.userProxy.save(user);
    } catch (error) {
      console.log(error);
    }
  }

  private async update(user: User) {
    try {
      await this.userProxy.update(user);
    } catch (error) {
      console.log(error);
    }
  }

  public get delegate() : IUserForm {
    return this.viewComponent
  }

}
