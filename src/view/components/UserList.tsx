//
//  UserList.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ApplicationConstants, ParamList } from "../../ApplicationConstants";
import { User } from "../../model/valueObject/User";
import { ApplicationFacade } from "../../ApplicationFacade";

interface Props {
  navigation: StackNavigationProp<ParamList, "UserList">;
  route: RouteProp<ParamList, "UserList">;
}

export interface IUserList {
  DELETE: string,
  setUsers: (users: Partial<User>[]) => void
}

const UserList: React.FC<Props> = ({ navigation, route }) => {

  const [users, setUsers] = useState<Partial<User>[]>([]); // User Data

  const component: IUserList = useMemo(() => ({
    DELETE: "UserListDelete",
    setUsers: setUsers,
  }), [setUsers]);

  useEffect(() => {
    ApplicationFacade.getInstance().register(component, ApplicationConstants.USER_LIST)

    return () => {
      ApplicationFacade.getInstance().unregister(component, ApplicationConstants.USER_LIST)
    };
  }, [component]);

  useEffect(() => {
    if (route.params?.user.roles) { // updated user from the User Form
        setUsers((users: Partial<User>[]) => {
          if (users.some(user => user.id === route.params?.user.id))  // existing, update
            return users.map((user: Partial<User>) => user.id === route.params?.user.id ? route.params?.user : user)
          else
            return [...users, route.params?.user] // add new
        });
    }
  }, [route.params?.user]);

  const onPress = (user: Partial<User>) => {
    navigation.navigate("UserForm", { user: user });
  };

  return (
      <View style={styles.container}>
        <FlatList<Partial<User>> data={users}
          ListEmptyComponent={<Text>No Users Found</Text>}
          keyExtractor={(user: Partial<User>) => `user_${user.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onPress(item)}>
              <Text style={styles.user}>{item.last}, {item.first}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  user: {
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default UserList;
