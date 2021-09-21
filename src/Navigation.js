import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Devices from "./components/devices/index";
import Commissioning from "./components/commissioning/index";
import Monitor from "./components/monitor/index";
import Settings from "./components/settings/index";
import Diagnosis from "./components/diagnosis/index";

export default function Navigation() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Devices"
          component={Devices}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Commissioning"
          component={Commissioning}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Monitor"
          component={Monitor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Diagnosis"
          component={Diagnosis}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
