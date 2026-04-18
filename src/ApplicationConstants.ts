//
//  ApplicationConstants.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import { User } from "./model/valueObject/User";
import { Role } from "./model/valueObject/Role";

export class ApplicationConstants {
  public static KEY: string = "employeeAdmin";

  public static STARTUP: string = "startup";
  public static REGISTER: string = "register";
  public static UNREGISTER: string = "unregister";

  static USER_LIST = "userList";
  static USER_FORM = "userForm";
  static USER_ROLE = "userRole";
}

export type ParamList = {
  UserList: {user: User};
  UserForm: {user: Partial<User>};
  UserRole: {user: User };
};
