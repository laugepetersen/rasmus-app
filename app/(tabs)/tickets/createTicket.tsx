import { createTicket } from "@/db";
import { auth } from "@/firebaseConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView from "react-native-maps";
import SelectDropdown from "react-native-select-dropdown";

export default function CreateTicket() {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [location, setLocation] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const user = auth.currentUser;

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    }

    getCurrentLocation();
  }, []);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !location) {
      alert("Title and location are required");
      return;
    }
    createTicket({
      title,
      description: description || "",
      location,
      image: image || "",
      onSuccess: () => {
        alert("Ticket created successfully");
        user ? router.back() : router.replace("/tickets/createTicket");
      },
    });
  };

  const locations = [
    "Solbjerg Toilet ved indgangen",
    "Solbjreg Toilet ved kantine",
    "Solbjerg Toilet 2nd. sa",
    "Solbjerg Toilet 2nd. sa",
    "Solbjerg Toilet 2nd. sa",
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Create Ticket",
          headerBackTitle: "Back",
        }}
      />
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <MapView
              style={{ aspectRatio: 5 / 3 }}
              showsUserLocation={true}
              followsUserLocation={true}
            />
            <TextInput
              placeholderTextColor={"#555"}
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Problem"
            />
            <SelectDropdown
              data={locations}
              onSelect={(selectedItem: string, index: number) => {
                setLocation(selectedItem);
              }}
              renderButton={(selectedItem: string, isOpened: boolean) => {
                return (
                  <View
                    style={[
                      styles.input,
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: "black" }}>
                      {selectedItem || "Select location"}
                    </Text>
                    <MaterialIcons
                      name={isOpened ? "arrow-drop-up" : "arrow-drop-down"}
                      size={24}
                      color="black"
                    />
                  </View>
                );
              }}
              renderItem={(
                item: string,
                index: number,
                isSelected: boolean
              ) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
            <TextInput
              placeholderTextColor={"#555"}
              style={[styles.input, { height: 140 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              numberOfLines={4}
              multiline
            />
            <TouchableOpacity
              style={{
                borderColor: "#285D43",
                borderWidth: 1,
                padding: 15,
                borderRadius: 5,
              }}
              onPress={handleImagePicker}
            >
              <Text style={{ color: "#285D43", textAlign: "center" }}>
                Take Photo
              </Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100 }}
              />
            )}

            <TouchableOpacity
              style={{
                borderColor: "#285D43",
                borderWidth: 1,
                padding: 15,
                borderRadius: 5,
              }}
              onPress={handleImagePicker}
            >
              <Text style={{ color: "#285D43", textAlign: "center" }}>
                Scan QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create Ticket</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    justifyContent: "center",
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "black",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#285D43",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
