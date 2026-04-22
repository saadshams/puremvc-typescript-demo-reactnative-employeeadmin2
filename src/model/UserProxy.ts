//
//  UserProxy.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { User } from "./valueObject/User";
import { Department } from "./valueObject/Department";
import {Platform} from "react-native";

export class UserProxy extends Proxy {

  public static NAME = "UserProxy";

  constructor() {
    super(UserProxy.NAME, null);
  }

  public async findAllUsers(): Promise<Partial<User>[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users`)
    if (response.status === 200) {
      const data = await response.json();
      return data.map((user: User) => ({ id: user.id, first: user.first, last: user.last }));
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  public async findUserById(id: number): Promise<User> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${id}`);
    if (response.status === 200) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  public async deleteById(id: number): Promise<void> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${id}`, {
          method: "DELETE"
        }
    );

    if (response.status === 204) {
      return;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async save(user: User) {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(user)
        }
    );

    if (response.status === 201) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async update(user: User) {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        }
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  public async findAllDepartments(): Promise<Department[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/departments`);
    if (response.status === 200) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

}
