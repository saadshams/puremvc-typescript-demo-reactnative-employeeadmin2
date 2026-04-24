//
//  Department.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

export interface Department {
  id: number;
  name: string;
}

export const DEFAULT_DEPARTMENT: Department = {id: 0, name: "None Selected"};
