import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { Murmur, User } from "../types/types";

const MURMURS_PER_PAGE = 10;

// --- Murmur (Tweet) Services ---

export const getMurmurs = async (lastDoc: any = null) => {
  let q;
  if (lastDoc) {
    q = query(
      collection(db, "murmurs"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(MURMURS_PER_PAGE)
    );
  } else {
    q = query(
      collection(db, "murmurs"),
      orderBy("createdAt", "desc"),
      limit(MURMURS_PER_PAGE)
    );
  }
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Murmur
  );
  return { data, lastVisible: snapshot.docs[snapshot.docs.length - 1] };
};

export const createMurmur = async (text: string, userName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Unauthorized");

  await addDoc(collection(db, "murmurs"), {
    text,
    userId: user.uid,
    userName,
    likeCount: 0,
    createdAt: Date.now(),
  });
};

export const deleteMurmur = async (murmurId: string) => {
  await deleteDoc(doc(db, "murmurs", murmurId));
};

export const likeMurmur = async (murmurId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const likeRef = doc(db, "likes", `${user.uid}_${murmurId}`);
  const likeSnap = await getDoc(likeRef);

  if (!likeSnap.exists()) {
    // Like
    await setDoc(likeRef, { userId: user.uid, murmurId });
    await updateDoc(doc(db, "murmurs", murmurId), { likeCount: increment(1) });
  }
  // Optional: Implement unlike logic here if needed
};

// --- User Services ---

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as User) : null;
};

export const followUser = async (targetUserId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const followRef = doc(db, "follows", `${currentUser.uid}_${targetUserId}`);
  await setDoc(followRef, {
    followerId: currentUser.uid,
    followingId: targetUserId,
  });

  // Update counts
  await updateDoc(doc(db, "users", currentUser.uid), {
    followingCount: increment(1),
  });
  await updateDoc(doc(db, "users", targetUserId), {
    followersCount: increment(1),
  });
};
