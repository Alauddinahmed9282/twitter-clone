import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { auth } from "../config/firebaseConfig";
import { getUserProfile, followUser, deleteMurmur } from "../services/api";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Murmur, User } from "../types/types";

export default function ProfileScreen({ route, navigation }: any) {
  // Params থেকে userId নিবো, না থাকলে current user
  const targetUserId = route.params?.userId || auth.currentUser?.uid;
  const isOwnProfile = targetUserId === auth.currentUser?.uid;

  const [user, setUser] = useState<User | null>(null);
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);

  useEffect(() => {
    loadProfile();
  }, [targetUserId]);

  const loadProfile = async () => {
    if (!targetUserId) return;

    // 1. Get User Info
    const userData = await getUserProfile(targetUserId);
    setUser(userData);

    // 2. Get User's Murmurs
    const q = query(
      collection(db, "murmurs"),
      where("userId", "==", targetUserId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    setMurmurs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Murmur));
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
    loadProfile(); // Refresh counts
  };

  if (!user) return <Text>Loading Profile...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
        <Text>
          Followers: {user.followersCount} | Following: {user.followingCount}
        </Text>
        {!isOwnProfile && <Button title="Follow" onPress={handleFollow} />}
      </View>

      <FlatList
        data={murmurs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.murmurItem}>
            <Text>{item.text}</Text>
            <Text style={styles.likes}>Likes: {item.likeCount}</Text>
            {isOwnProfile && (
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 20, alignItems: "center" },
  name: { fontSize: 24, fontWeight: "bold" },
  murmurItem: {
    padding: 15,
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 8,
  },
  likes: { color: "gray", marginTop: 5 },
});
