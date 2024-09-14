import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"
import app from "../config/firebase";

const db = getFirestore(app);

export const addData = async (collectionName: string, data:object) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    }catch (e) {
        console.error("Error adding: ", e);
    }
};

export const getData = async (collectionName: string) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    }catch (e) {
        console.error("Error getting: ", e);
    }
};

export const updateData = async (collectionName: string, docId: string, newData: object) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, newData);
    }catch (e){
        console.error("Error updatin: ", e);
    }
};

export const deleteData = async (collectionName: string, docId: string) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    }catch (e){
        console.error("Error deleting: ", e);
    }
};
