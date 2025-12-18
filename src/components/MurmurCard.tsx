import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { likeMurmur } from "../services/api";
import { Murmur } from "../types/types";

interface Props {
  item: Murmur;
  onPressUser: () => void;
}

export default function MurmurCard({ item, onPressUser }: Props) {
  const [likes, setLikes] = React.useState(item.likeCount);

  const handleLike = async () => {
    setLikes((prev) => prev + 1); // Optimistic Update
    await likeMurmur(item.id);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPressUser}>
        <Text style={styles.username}>@{item.userName}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.footer}>
        <Text style={styles.likeText}>❤️ {likes}</Text>
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
    elevation: 2,
  },
  username: { fontWeight: "bold", marginBottom: 5, color: "#007AFF" },
  text: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeText: { fontSize: 14, color: "#555" },
});
