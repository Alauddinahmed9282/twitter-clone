import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { getMurmurs } from "../services/api";
import { Murmur } from "../types/types";
import MurmurCard from "../components/MurmurCard"; // Assume simple card component

export default function HomeScreen({ navigation }: any) {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMurmurs = async (loadMore = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getMurmurs(loadMore ? lastDoc : null);
      setMurmurs((prev) => (loadMore ? [...prev, ...res.data] : res.data));
      setLastDoc(res.lastVisible);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMurmurs();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Post New Murmur"
        onPress={() => navigation.navigate("PostMurmur")}
      />
      <FlatList
        data={murmurs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Pass navigation to go to user details
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
});
