//
//  UserForm.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useRef, useState} from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { ApplicationConstants, ParamList } from "../../ApplicationConstants";
import { User, createDefaultUser } from "../../model/valueObject/User";
import { Department, DEFAULT_DEPARTMENT } from "../../model/valueObject/Department";
import { ApplicationFacade } from "../../ApplicationFacade";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  navigation: StackNavigationProp<ParamList, "UserForm">;
  route: RouteProp<ParamList, "UserForm">;
}

export interface IUserForm {
  findAllDepartments: () => Promise<Department[]>,
  findUserById: (id: number) => Promise<User>,
  save: (user: User) => Promise<void>,
  update: (user: User) => Promise<void>,
}

const UserForm: React.FC<Props> = ( {navigation, route} ) => {

  const [departments, setDepartments] = useState<Department[]>([]); // UI Data
  const [user, setUser] = useState<User>(createDefaultUser()); // User Data

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";

  const delegate = useRef<IUserForm>({
    findAllDepartments: async (): Promise<Department[]> => [],
    findUserById: async (id: number): Promise<User> => createDefaultUser(),
    save: async (user: User): Promise<void> => {},
    update: async (user: User): Promise<void> => {},
  });

  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate.current, ApplicationConstants.USER_FORM);

    (async () => {
      try {
        setDepartments(await delegate.current.findAllDepartments());
      } catch (error) {
        console.error("Failed to load departments:", error);
      }

      if (!route.params?.user.id) return;
      try {
        let data = await delegate.current.findUserById(route.params.user.id) // if id is passed from UserList
        setUser({...data, confirm: data.password});
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    })();

    return () => {
      ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_FORM)
    }
  }, []);

  // text fields handler
  const onChange = (field: keyof User, value: string) => {
    setUser((state: User) => (
      { ...state, [field]: value } as User
    ));
  }

  // department handler
  const onValueChange = (value: number, index: number) => {
    setUser((state: User) => (
      { ...state, department: value === 0 ? DEFAULT_DEPARTMENT : departments.find(department => department.id === value)} as User
    ));
    setTimeout(() => setIsPickerVisible(false), 150);
  }

  // Roles handler
  const onRoles = (event: any) => {
    navigation.navigate("UserRole", { user: user });
  }

  // save handler
  const onSave = (event: any) => {
    user.id === 0 ? delegate.current.save(user) : delegate.current.update(user)
    navigation.goBack();
  }

  // cancel handler
  const onCancel = (event: any) => {
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="First Name" value={user?.first} onChangeText={(value) => onChange("first", value)} />
        <TextInput style={styles.input} placeholder="Last Name" value={user?.last} onChangeText={(value) => onChange("last", value)} />
      </View>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Email" value={user?.email} onChangeText={(value) => onChange("email", value)} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Username" value={user?.username} onChangeText={(value) => onChange("username", value)} />
      </View>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Password" value={user?.password} onChangeText={(value) => setUser( ({...user, password: value } as User) )} />
        <TextInput style={styles.input} placeholder="Confirm" value={user?.confirm} onChangeText={(value) => setUser( ({...user, confirm: value } as User) )} />
      </View>
      <View style={styles.row}>
        <View style={isAndroid ? styles.androidContainer : styles.iosContainer}>
          {isIOS && (
              <TouchableOpacity style={styles.iosTrigger} onPress={() => setIsPickerVisible((flag) => !flag)}>
                <Text style={styles.iosDisplayText}>
                  {departments.find((department) => department.id === user.department.id)?.name ?? DEFAULT_DEPARTMENT.name }
                </Text>
                <MaterialIcons name={isPickerVisible ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#666" style={styles.arrow} />
              </TouchableOpacity>
          )}

          {(isAndroid || (isIOS && isPickerVisible)) && (
              <Picker itemStyle={{fontSize: 16}}  selectedValue={user.department.id} onValueChange={onValueChange} style={isAndroid ? undefined : styles.iosPicker} mode={isAndroid ? "dropdown" : undefined}>
                <Picker.Item label={DEFAULT_DEPARTMENT.name} value={0} />
                {departments.map((department) => (
                    <Picker.Item key={department.id.toString()} label={department.name} value={department.id} />
                ))}
              </Picker>
          )}
        </View>
        <TouchableOpacity style={[styles.button, styles.roles]} onPress={onRoles}>
          <Text style={styles.buttonText}>ROLES</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
          <Text style={styles.buttonText}>{route.params?.user.id ? "UPDATE" : "SAVE"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 5,
    paddingHorizontal: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden',
    justifyContent: 'center', // vertical centering
    height: Platform.OS === 'ios' ? 150 : 50, // iOS wheel taller
  },
  picker: {
    flex: 1,  // fills container
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center"
  },
  cancel: {
    backgroundColor: "#D32F2F",
  },
  save: {
    backgroundColor: "#4CAF50",
  },
  update: {
    backgroundColor: "#2196F3",
  },
  roles: {
    backgroundColor: "#9C27B0",
  },

  // picker
  androidContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    height: 40,
  },
  iosContainer: {
    flex: 1,
    zIndex: 10
  },
  iosTrigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  iosDisplayText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 8,
  },
  arrow: {
    paddingRight: 8
  },
  iosPicker: {
    position: "absolute",
    top: 40,
    left: 5,
    right: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default UserForm;
