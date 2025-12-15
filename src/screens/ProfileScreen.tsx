import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { auth } from "../config/firebaseConfig";
import {
  getUserProfile,
  followUser,
  deleteMurmur,
  getUserMurmurs,
} from "../services/api";
import { Murmur, User } from "../types/types";

export default function ProfileScreen({ route, navigation }: any) {
  const targetUserId = route.params?.userId || auth.currentUser?.uid;
  const isOwnProfile = targetUserId === auth.currentUser?.uid;

  const [user, setUser] = useState<User | null>(null);
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);

  useEffect(() => {
    loadProfile();
  }, [targetUserId]);

  const loadProfile = async () => {
    console.log("Loading profile for userId:", targetUserId);

    // if (!targetUserId) return;

    const userData = await getUserProfile(targetUserId);
    console.log("Fetched user data:");

    setUser(userData);

    const userMurmurs = await getUserMurmurs(targetUserId);

    setMurmurs(userMurmurs);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMurmur(id);
      setMurmurs((prev) => prev.filter((m) => m.id !== id));
      Alert.alert("Deleted", "Murmur deleted successfully.");
    } catch (error) {
      Alert.alert("Error", "Could not delete.");
    }
  };

  const handleFollow = async () => {
    await followUser(targetUserId);
    loadProfile();
    Alert.alert("Success", "You are now following this user.");
  };

  if (!user)
    return (
      <Text style={{ padding: 20 }}>Loading Profile or User Not Found...</Text>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.stats}>
          Followers: {user.followersCount || 0} | Following:{" "}
          {user.followingCount || 0}
        </Text>
        {!isOwnProfile && <Button title="Follow" onPress={handleFollow} />}
      </View>

      <Text style={styles.sectionTitle}>Murmurs</Text>
      <FlatList
        data={murmurs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.murmurItem}>
            <Text style={styles.murmurText}>{item.text}</Text>
            <View style={styles.row}>
              <Text style={styles.likes}>❤️ {item.likeCount}</Text>
              {isOwnProfile && (
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => handleDelete(item.id)}
                />
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    marginBottom: 20,
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 24, fontWeight: "bold" },
  stats: { marginVertical: 10, color: "gray" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  murmurItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 8,
  },
  murmurText: { fontSize: 16, marginBottom: 5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likes: { color: "gray" },
});
