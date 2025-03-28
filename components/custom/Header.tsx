import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";


const Header = () => {
    const { user } = useUser();
    const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
      }}>
      <Image
        source={{
          uri: user?.profilePicture || "../../assets/images/profile.png",
        }}
        style={{ width: 40, height: 40, borderRadius: 20, borderColor: "#fff", borderWidth: 1 }}
      />
      <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "bold" }}>
        {user?.name || "User"}
      </Text>
      <TouchableOpacity style={{ marginLeft: "auto" }} onPress={() => {router.push("/settings")}}>
        <Text style={{ fontSize: 24 }}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
