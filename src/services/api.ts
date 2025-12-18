import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { Murmur, User } from "../types/types";

const MURMURS_PER_PAGE = 10;

// --- Murmur Services ---
export const getMurmurs = async (lastDoc: any = null) => {
  try {
    let q;
    const murmursRef = collection(db, "murmurs");

    if (lastDoc) {
      q = query(
        murmursRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(MURMURS_PER_PAGE)
      );
    } else {
      q = query(
        murmursRef,
        orderBy("createdAt", "desc"),
        limit(MURMURS_PER_PAGE)
      );
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Murmur
    );

    return { data, lastVisible: snapshot.docs[snapshot.docs.length - 1] };
  } catch (error) {
    console.error("Error fetching murmurs:", error);
    return { data: [], lastVisible: undefined };
  }
};

export const createMurmur = async (text: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userName = user.displayName || user.email?.split("@")[0] || "Anonymous";

  await addDoc(collection(db, "murmurs"), {
    text,
    userId: user.uid,
    userName: userName,
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
    await setDoc(likeRef, { userId: user.uid, murmurId });
    await updateDoc(doc(db, "murmurs", murmurId), { likeCount: increment(1) });
  }
};

// --- User Services ---
export const createUserProfile = async (uid: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid,
      name: email.split("@")[0],
      email,
      followersCount: 0,
      followingCount: 0,
    });
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  console.log("User profile snap exists:", snap.exists());
  return snap.exists() ? (snap.data() as User) : null;
};

export const getUserMurmurs = async (userId: string) => {
  const q = query(
    collection(db, "murmurs"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  console.log("Query for user murmurs:", q);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Murmur);
};

export const followUser = async (targetUserId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const followRef = doc(db, "follows", `${currentUser.uid}_${targetUserId}`);
  await setDoc(followRef, {
    followerId: currentUser.uid,
    followingId: targetUserId,
  });

  await updateDoc(doc(db, "users", currentUser.uid), {
    followingCount: increment(1),
  });
  await updateDoc(doc(db, "users", targetUserId), {
    followersCount: increment(1),
  });
};
