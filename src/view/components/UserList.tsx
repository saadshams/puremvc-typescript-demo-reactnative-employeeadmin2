//
//  UserList.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp, useFocusEffect} from "@react-navigation/native";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {User} from "../../model/valueObject/User";
import {ApplicationFacade} from "../../ApplicationFacade";

interface Props {
  navigation: StackNavigationProp<ParamList, "UserList">;
  route: RouteProp<ParamList, "UserList">;
}

export interface IUserList {
  findAllUsers: () => Promise<Partial<User>[]>,
  deleteById: (id: number) => Promise<void>,
}

const UserList: React.FC<Props> = ({ navigation, route }) => {

  const [users, setUsers] = useState<Partial<User>[]>([]); // User Data

  const delegate = useRef<IUserList>({
    findAllUsers: async () => [],
    deleteById: async (_id: number) => {},
  });

  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate.current, ApplicationConstants.USER_LIST)

    return () => {
      ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_LIST)
    };
  }, []);

  useFocusEffect(
      useCallback(() => {
        let isActive = true;

        void (async () => {
          try {
            const data = await delegate.current.findAllUsers();
            if (isActive) setUsers(data);
          } catch (error) {
            console.error("Failed to sync users:", error);
          }
        })();

        return () => {
          isActive = false;
        };
      }, [])
  );

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
