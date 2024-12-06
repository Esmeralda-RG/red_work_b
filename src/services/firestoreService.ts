import { getFirestore, DocumentData, QuerySnapshot, DocumentSnapshot, CollectionGroup } from "firebase-admin/firestore";
import app from "../config/firebase";
import { query } from "express";

const db = getFirestore(app);

export const addData = async (collectionName: string, data: object): Promise<string> => {
    try {
        const collectionRef = db.collection(collectionName);
        const docRef = await collectionRef.add(data);
        return docRef.id;
    }catch (e) {
        throw e;
    }
};

export const createRequestInFirebase = async (data: any) => {
    try {
        const requestRef = await db.collection('requests').add(data);
        return requestRef.id; 
    } catch (e) {
        throw e;
    }
};

export const getData = async (collectionName: string): Promise<object[]> => {
    try {
        const collectionRef = db.collection(collectionName);
        const querySnapshot: QuerySnapshot<DocumentData> = await collectionRef.get();
        return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
    }catch (e) {
        throw e;
    }
};

export const getDataById = async (CollectionName: string, id: string): Promise<object | null> => {
    try {
        const docRef = db.collection(CollectionName).doc(id);
        const docSnapshot: DocumentSnapshot = await docRef.get();
        if (!docSnapshot.exists){
            return null;
        }
        return { id: docSnapshot.id, ...docSnapshot.data() };
    }catch (e) {
        throw e;
    }
}

export const getDataByPhone = async (phone: string): Promise<Object | null> => {
    try {
        const workerRef = db.collection('workers');
        const querySnapshot = await workerRef.where('phone','==', phone).get();
        if (querySnapshot.empty){
            return null;
        }
        const workerData = querySnapshot.docs[0];
        return { id: workerData.id, ...workerData.data()};
    } catch(e) {
        throw e;
    }
}

export const getDataByCategory = async (category: string): Promise<object[]> => {
    try {
        const workersRef = db.collection('workers');
        const querySnapshot = await workersRef.where('category', '==', category).get();
        if (querySnapshot.empty) {
            return [];
        }
        return querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        throw e;
    }
};


export const updateData = async (collectionName: string, docId: string, newData: object): Promise<void> => {
    try {
        const docRef = db.collection(collectionName).doc(docId);
        await docRef.update(newData);
    }catch (e) {
        throw e;
    }
};

export const deleteData = async (collectionName: string, docId: string): Promise<void> => {
    try {
        const docRef = db.collection(collectionName).doc(docId);
        await docRef.delete();
    }catch (e) {
        throw e;
    }
};
