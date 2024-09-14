import { getFirestore, CollectionReference, DocumentData, QuerySnapshot, DocumentSnapshot } from "firebase-admin/firestore";
import app from "../config/firebase";

const db = getFirestore(app);

export const addData = async (collectionName: string, data: object): Promise<string | undefined> => {
    try {
        const collectionRef = db.collection(collectionName);
        const docRef = await collectionRef.add(data);
        return docRef.id;
    }catch (e) {
        console.error("Error adding: ", e);
    }
};

export const getData = async (collectionName: string): Promise<any[]> => {
    try {
        const collectionRef = db.collection(collectionName);
        const querySnapshot: QuerySnapshot<DocumentData> = await collectionRef.get();
        return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
    }catch (e) {
        console.error("Error getting: ", e);
        return [];
    }
};

export const updateData = async (collectionName: string, docId: string, newData: object): Promise<void> => {
    try {
        const docRef = db.collection(collectionName).doc(docId);
        await docRef.update(newData);
    }catch (e) {
        console.error("Error updating: ", e);
    }
};

export const deleteData = async (collectionName: string, docId: string): Promise<void> => {
    try {
        const docRef = db.collection(collectionName).doc(docId);
        await docRef.delete();
    }catch (e) {
        console.error("Error deleting: ", e);
    }
};
