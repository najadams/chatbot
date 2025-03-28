import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

const resources = [
  {
    id: "1",
    type: "video",
    title: "Python Basics Tutorial",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    type: "book",
    title: "Python for Beginners",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    type: "article",
    title: "10 Tips for Learning Python",
    image: "https://via.placeholder.com/150",
  },
];

const ResourceRecommendations = () => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Recommended Resources
      </Text>
      <FlatList
        horizontal
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 150, height: 150, borderRadius: 8 }}
            />
            <Text style={{ marginTop: 8, fontSize: 16 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ResourceRecommendations;
