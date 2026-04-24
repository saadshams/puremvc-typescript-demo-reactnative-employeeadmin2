//
//  User.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {DEFAULT_DEPARTMENT, Department} from "./Department";
import {Role} from "./Role";

export interface User {
  id: number;
  username: string;
  first: string;
  last: string;
  email: string;
  password: string;
  confirm: string;
  department: Department;
  roles: Role[];
}

export function createDefaultUser(): User {
  return {
    id: 0,
    username: "",
    first: "",
    last: "",
    email: "",
    password: "",
    confirm: "",
    department: DEFAULT_DEPARTMENT,
    roles: [],
  };
}
