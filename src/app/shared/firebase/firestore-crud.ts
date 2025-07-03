import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc,
    DocumentData,
    DocumentReference,
    QueryDocumentSnapshot,
    query,
    where,
  } from 'firebase/firestore';
import { db } from './clientApp';
import { validCollection } from '../utils/firestoreConverters';
  
  // Create a new document with auto-generated ID

  export async function createDoc<T>(collectionName: string, data: T): Promise<string> {
    const colRef = validCollection<T>(collectionName);
    const docRef = await addDoc(colRef, data as DocumentData);
    return docRef.id;
  }

  // Create a new document with a custom ID
  export async function createDocWithCustomId<T extends { id: string }>(
    collectionName: string,
    data: T
  ): Promise<string> {
    const colRef = validCollection<T>(collectionName);
    const docRef = doc(colRef, data.id); // use your own ID
    await setDoc(docRef, data as DocumentData);
    return data.id;
  }
  
  
  // Create or overwrite a document with a specific ID
  export async function setDocById<T>(collectionName: string, id: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data as DocumentData);
  }
  
  // Get a document by ID
  export async function getDocById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }
  
  // Get all documents from a collection
  export async function getCollection<T>(collectionName: string): Promise<(T & { id: string })[]> {
    const querySnapshot = await getDocs(validCollection(collectionName));
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  }
  
  // Update a document
  export async function updateDocById<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data as DocumentData);
  }
  
  // Delete a document
  export async function deleteDocById(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

export async function getDocByField<T>(collectionName: string, field: string, value: string): Promise<(T & { id: string })> {
    const querySnapshot = await getDocs(query(collection(db, collectionName), where(field, '==', value)));
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string });
  }

  