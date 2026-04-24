//
//  Application.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';

import {ParamList} from "./ApplicationConstants";
import {ApplicationFacade} from "./ApplicationFacade";
import {createDefaultUser} from "./model/valueObject/User";
import UserList from "./view/components/UserList";
import UserForm from "./view/components/UserForm";
import UserRole from "./view/components/UserRole";

ApplicationFacade.getInstance().startup();

const Stack = createStackNavigator<ParamList>();

const Application: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserList} options={({navigation}) => ({
          title: "User List",
          headerRight: () => (
            <TouchableOpacity onPress={() => {
              navigation.navigate("UserForm", {user: createDefaultUser()})
            }} style={{marginRight: 16}}>
              <FontAwesome5 name="plus" size={24} color="#007AFF"/>
            </TouchableOpacity>)
        })}/>
        <Stack.Screen name="UserForm" component={UserForm} options={{title: "User Form"}}/>
        <Stack.Screen name="UserRole" component={UserRole} options={{title: "User Role"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Application;
