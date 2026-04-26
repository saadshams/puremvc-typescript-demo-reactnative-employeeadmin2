//
//  UserRole.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import {RouteProp} from "@react-navigation/native";
import Checkbox from 'expo-checkbox';
import {StackNavigationProp} from "@react-navigation/stack";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {Role} from "../../model/valueObject/Role";
import {ApplicationFacade} from "../../ApplicationFacade";

interface Props {
  navigation: StackNavigationProp<ParamList, "UserRole">;
  route: RouteProp<ParamList, "UserRole">;
}

export interface IUserRole {
  findAllRoles: (signal: AbortSignal) => Promise<Role[]>,
  findRolesByUserId: (id: number, signal: AbortSignal) => Promise<Role[]>
}

const UserRole: React.FC<Props> = ({navigation, route}) => {

  const [roles, setRoles] = useState<Role[]>([]); // UI Data
  const [data, setData] = useState<Role[]>([]); // User Data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const delegate = useRef<IUserRole>({
    findAllRoles: async (_signal: AbortSignal): Promise<Role[]> => [],
    findRolesByUserId: async (_id: number, _signal): Promise<Role[]> => [],
  }).current;

  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_ROLE);
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_ROLE);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        setRoles(await delegate.findAllRoles(controller.signal));
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (roles.length === 0) return;

    if (route.params?.user.roles.length == 0) {
      return setIsLoading(false);
    }

    const controller = new AbortController();

    void (async () => {
      try {
        if (route.params?.user.roles.length === 0 || route.params?.user.id === 0) {
          return setData(route.params?.user.roles);
        }
        setData(await delegate.findRolesByUserId(route.params?.user.id, controller.signal));
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [roles]);

  const onChange = (role: Role) => {
    setData((state) => {
      if (state.some(r => r.id === role.id)) {
        return state.filter(r => r.id !== role.id); // Remove
      } else {
        return [...state, role]; // Add
      }
    });
  }

  const onSave = () => {
    route.params.user.roles = data;
    if (navigation.canGoBack()) navigation.goBack();
  }

  const onCancel = () => {
    if (navigation.canGoBack()) navigation.goBack();
  }

  // UI Helpers
  function list() {
    return (
      <>
        {roles?.map((role: Role) => (
          <View key={`role_${role.id}`} style={styles.item}>
            <Checkbox value={data.some(r => r.id === role.id)} onValueChange={() => onChange(role)}/>
            <Text style={styles.label}>{role.name}</Text>
          </View>
        ))}
      </>
    );
  }

  function cancel() {
    return (<Button title="Cancel" onPress={onCancel}/>);
  }

  function save() {
    return (<Button title="Save" onPress={onSave}/>);
  }

  return (
    <>
      { isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {list()}
          </ScrollView>
          <View style={styles.sticky}>
            <>{cancel()}{save()}</>
          </View>
        </View>
      )}
    </>

  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  scrollView: {
    marginBottom: 60
  },
  checkbox: {
    backgroundColor: "transparent",
  },
  label: {
    marginLeft: 25,
    fontSize: 18,
  },
  sticky: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});

export default UserRole;
