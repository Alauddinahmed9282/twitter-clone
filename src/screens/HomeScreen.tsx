import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { getMurmurs, createMurmur } from "../services/api";
import { Murmur } from "../types/types";
import MurmurCard from "../components/MurmurCard";
import { auth } from "../config/firebaseConfig";

export default function HomeScreen({ navigation }: any) {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState("");

  const fetchMurmurs = async (loadMore = false) => {
    if (loading) return;
    setLoading(true);
    const res = await getMurmurs(loadMore ? lastDoc : null);

    if (loadMore) {
      setMurmurs((prev) => [...prev, ...res.data]);
    } else {
      setMurmurs(res.data);
    }

    setLastDoc(res.lastVisible);
    setLoading(false);
  };

  useEffect(() => {
    fetchMurmurs();
  }, []);

  const handlePost = async () => {
    if (!newText.trim()) return;
    try {
      await createMurmur(newText);
      setNewText("");
      fetchMurmurs(); // রিফ্রেশ লিস্ট
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Logout" onPress={handleLogout} color="red" />
        <Button
          title="My Profile"
          onPress={() =>
            navigation.navigate("Profile", { userId: auth.currentUser?.uid })
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's happening?"
          value={newText}
          onChangeText={setNewText}
        />
        <Button title="Post" onPress={handlePost} />
      </View>

      <FlatList
        data={murmurs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MurmurCard
            item={item}
            onPressUser={() =>
              navigation.navigate("Profile", { userId: item.userId })
            }
          />
        )}
        onEndReached={() => {
          if (lastDoc) fetchMurmurs(true);
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        refreshing={loading}
        onRefresh={() => fetchMurmurs(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputContainer: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});
