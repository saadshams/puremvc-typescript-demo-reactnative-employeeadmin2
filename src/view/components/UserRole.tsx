//
//  UserRole.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useRef, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";
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
  findAllRoles: () => Promise<Role[]>,
  findRolesByUserId: (id: number) => Promise<Role[]>
}

const UserRole: React.FC<Props> = ({navigation, route}) => {

  const [roles, setRoles] = useState<Role[]>([]); // UI Data
  const [data, setData] = useState<Role[]>([]); // User Data

  const delegate = useRef<IUserRole>({
    findAllRoles: async (): Promise<Role[]> => [],
    findRolesByUserId: async (_id: number): Promise<Role[]> => [],
  }).current;

  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_ROLE);

    (async () => {
      setRoles(await delegate.findAllRoles());
      if (route.params?.user.roles.length > 0) {
        setData(route.params.user.roles);
        return;
      }
      if (route.params?.user.id) {
        setData(await delegate.findRolesByUserId(route.params.user.id));
      }
    })();

    return () => {
      ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_ROLE)
    };
  }, []);

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
    navigation.goBack();
  }

  const onCancel = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {list()}
      </ScrollView>
      <View style={styles.sticky}>
        <>{cancel()}{save()}</>
      </View>
    </View>
  );

  function list() {
    return (
      <>
        {roles?.map((role: Role) => (
          <View key={`role_${role.id}`} style={styles.item}>
            <Checkbox value={data.some(r => r.id === role.id)} onValueChange={() => onChange(role)}/>
            <Text style={styles.label}>{role.name}</Text>
            {/*<Checkbox title={role.name} containerStyle={styles.checkbox}*/}
            {/*          checked={data.some(r => r.id === role.id)} onPress={() => onChange(role)}*/}
            {/*          iconType="material-community" checkedIcon="checkbox-outline" uncheckedIcon={"checkbox-blank-outline"} />*/}
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
}

const styles = StyleSheet.create({
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
