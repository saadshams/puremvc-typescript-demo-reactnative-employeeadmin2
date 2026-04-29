//
//  UserForm.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Picker} from "@react-native-picker/picker";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {createDefaultUser, User} from "../../model/valueObject/User";
import {DEFAULT_DEPARTMENT, Department} from "../../model/valueObject/Department";
import {ApplicationFacade} from "../../ApplicationFacade";
import {MaterialIcons} from "@expo/vector-icons";

interface Props {
  navigation: StackNavigationProp<ParamList, "UserForm">;
  route: RouteProp<ParamList, "UserForm">;
}

export interface IUserForm {
  findAllDepartments: (signal: AbortSignal) => Promise<Department[]>,
  findUserById: (id: number, signal: AbortSignal) => Promise<User>,
  save: (user: User) => Promise<void>,
  update: (user: User) => Promise<void>,
}

const UserForm: React.FC<Props> = ({navigation, route}) => {

  // State
  const [departments, setDepartments] = useState<Department[]>([]); // UI Data
  const [user, setUser] = useState<User>(createDefaultUser()); // User Data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";

  const delegate = useRef<IUserForm>({
    findAllDepartments: async (_signal: AbortSignal): Promise<Department[]> => departments,
    findUserById: async (_id: number, _signal: AbortSignal): Promise<User> => user,
    save: async (_user: User): Promise<void> => {},
    update: async (_user: User): Promise<void> => {},
  }).current;

  // Effects
  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_FORM);
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_FORM);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const result = await delegate.findAllDepartments(controller.signal);
        if (!controller.signal.aborted) setDepartments(result);
      } catch (error) {
        if (!controller.signal.aborted)
          setError(error instanceof Error ? error : new Error(String(error)));
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (departments.length === 0) return;

    const controller = new AbortController();

    void (async () => {
      try {
        const id = route?.params?.user?.id ?? 0;
        if (id === 0) return setIsLoading(false);

        const result = await delegate.findUserById(id, controller.signal);
        if (!controller.signal.aborted) setUser({ ...result, confirm: result.password });
      } catch (error) {
        if (!controller.signal.aborted)
          setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [departments])

  // Handlers
  const onChange = (field: keyof User, value: string) => {
    setUser((state: User) => (
      {...state, [field]: value} as User
    ));
  }

  const onValueChange = (value: number, index: number) => {
    setUser((state: User) => (
      {
        ...state,
        department: value === 0 ? DEFAULT_DEPARTMENT : departments.find(department => department.id === value)
      } as User
    ));
    setTimeout(() => setIsPickerVisible(false), 150);
  }

  const onRoles = (event: any) => {
    navigation.navigate("UserRole", {user: user});
  }

  const onSave = async (event: any) => {
    try {
      user.id === 0 ? await delegate.save(user) : await delegate.update(user);
      if (navigation.canGoBack()) navigation.goBack();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  }

  const onCancel = (event: any) => { // cancel handler
    if (navigation.canGoBack()) navigation.goBack();
  }

  // UI Helpers
  function first() {
    return (<TextInput style={styles.input} placeholder="First Name" value={user?.first}
                       onChangeText={(value) => onChange("first", value)}/>);
  }

  function last() {
    return (<TextInput style={styles.input} placeholder="Last Name" value={user?.last}
                       onChangeText={(value) => onChange("last", value)}/>);
  }

  function email() {
    return (<TextInput style={styles.input} placeholder="Email" value={user?.email}
                       onChangeText={(value) => onChange("email", value)} keyboardType="email-address"/>);
  }

  function username() {
    return (<TextInput style={styles.input} placeholder="Username" value={user?.username}
                       onChangeText={(value) => onChange("username", value)}/>);
  }

  function password() {
    return (<TextInput style={styles.input} placeholder="Password" value={user?.password} secureTextEntry={true}
                       onChangeText={(value) => setUser(({...user, password: value} as User))}/>);
  }

  function confirm() {
    return (<TextInput style={styles.input} placeholder="Confirm" value={user?.confirm} secureTextEntry={true}
                       onChangeText={(value) => setUser(({...user, confirm: value} as User))}/>);
  }

  function department() {
    return (
      <View style={isAndroid ? styles.androidContainer : styles.iosContainer}>
        {isIOS && (
          <TouchableOpacity style={styles.iosTrigger} onPress={() => setIsPickerVisible((flag) => !flag)}>
            <Text style={styles.iosDisplayText}>
              {departments.find((department) => department.id === user.department.id)?.name ?? DEFAULT_DEPARTMENT.name}
            </Text>
            <MaterialIcons name={isPickerVisible ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#666" style={styles.arrow}/>
          </TouchableOpacity>
        )}

        {(isAndroid || (isIOS && isPickerVisible)) && (
          <Picker itemStyle={{fontSize: 16}} selectedValue={user.department.id} onValueChange={onValueChange}
                  style={isAndroid ? undefined : styles.iosPicker} mode={isAndroid ? "dropdown" : undefined}>
            <Picker.Item label={DEFAULT_DEPARTMENT.name} value={0}/>
            {departments.map((department) => (
              <Picker.Item key={department.id.toString()} label={department.name} value={department.id}/>
            ))}
          </Picker>
        )}
      </View>
    );
  }

  function roles() {
    return (
      <TouchableOpacity style={[styles.button, styles.roles]} onPress={onRoles}>
        <Text style={styles.buttonText}>ROLES</Text>
      </TouchableOpacity>
    );
  }

  function cancel() {
    return (
      <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
        <Text style={styles.buttonText}>CANCEL</Text>
      </TouchableOpacity>
    );
  }

  function save() {
    return (
      <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
        <Text style={styles.buttonText}>{route.params?.user.id ? "UPDATE" : "SAVE"}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      { isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.row}>
            <>{first()}{last()}</>
          </View>
          <View style={styles.row}>
            <>{email()}{username()}</>
          </View>
          <View style={styles.row}>
            <>{password()}{confirm()}</>
          </View>
          <View style={styles.row}>
            <>{department()}{roles()}</>
          </View>
          <View style={styles.row}>
            <>{cancel()}{save()}</>
          </View>
        </ScrollView>
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
    height: Platform.OS === 'ios' ? 150 : 50,
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  }
});

export default UserForm;
