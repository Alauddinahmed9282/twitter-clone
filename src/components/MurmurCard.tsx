import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { likeMurmur } from "../services/api";
import { Murmur } from "../types/types";

interface Props {
  item: Murmur;
  onPressUser: () => void;
}

export default function MurmurCard({ item, onPressUser }: Props) {
  const handleLike = async () => {
    await likeMurmur(item.id);
    // Note: In real app, update local state or use React Query to invalidate cache
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPressUser}>
        <Text style={styles.username}>@{item.userName}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.footer}>
        <Text>❤️ {item.likeCount}</Text>
        <Button title="Like" onPress={handleLike} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
  },
  username: { fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 16, marginBottom: 10 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
