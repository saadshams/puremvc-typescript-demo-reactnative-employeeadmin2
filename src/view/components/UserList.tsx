//
//  UserList.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useRef, useState} from "react";
import {ActivityIndicator, Animated, FlatList, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
  findAllUsers: (signal: AbortSignal) => Promise<Partial<User>[]>,
  deleteById: (id: number) => Promise<void>,
}

const UserList: React.FC<Props> = ({navigation, route}) => {

  const [users, setUsers] = useState<Partial<User>[]>([]); // User Data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const delegate = useRef<IUserList>({
    findAllUsers: async (_signal: AbortSignal) => [],
    deleteById: async (_id: number) => {},
  }).current;

  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_LIST)
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_LIST);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      delegate.findAllUsers(controller.signal)
        .then(data => {
          setUsers(data);
          setIsLoading(false);
        })
        .catch(setError);

      return () => controller.abort()
    }, [delegate])
  );

  function ListItem({ user }: { user: Partial<User> }) {
    const translateX = useRef(new Animated.Value(0)).current;

    const responder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          return Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
        },
        onPanResponderMove: (_, gesture) => {
          if (gesture.dx < 0) translateX.setValue(Math.max(gesture.dx, -100));
        },
        onPanResponderRelease: (_, gesture) => {
          Animated.spring(translateX, {toValue: gesture.dx < -50 ? -100 : 0, useNativeDriver: true,}).start();
        },
      })
    ).current;

    return (
      <View style={styles.swipeRow}>
        <TouchableOpacity style={styles.deleteAction} onPress={async () => {
          if (!user.id) return;
          try {
            await delegate.deleteById(user.id);
            setUsers((prev) => prev.filter((user) => user.id !== user.id));
          } catch (error) {
            console.error("Failed to delete user:", error);
          }
        }}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.rowContent, { transform: [{ translateX }] }]} {...responder.panHandlers}>
          <TouchableOpacity onPress={() => navigation.navigate("UserForm", {user: user})}>
            <Text style={styles.listItem}>{user.last}, {user.first}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <>
      { isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : users.length == 0 ? (
        <Text>No Users Found</Text>
      ) : (
        <View style={styles.container}>
          <FlatList<Partial<User>> data={users}
            keyExtractor={(user) => `user_${user.id}`}
            renderItem={({ item }) => <ListItem user={item}/>}
          />
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
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listItem: {
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  swipeRow: {
    position: "relative",
    overflow: "hidden",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },

  rowContent: {
    backgroundColor: "white",
  },
});

export default UserList;
