import { collection, CollectionReference, DocumentSnapshot, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "firebase/firestore";
import { db } from "../firebase/clientApp";

export function convertTimestampsToDates<T>(obj: T): T {

  if (obj && Array.isArray(obj)) {
    return obj.map(item => convertTimestampsToDates(item)) as unknown as T;
  }

  if (obj && typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Timestamp) {
        newObj[key] = value.toDate();
      } else if (typeof value === "object") {
        newObj[key] = convertTimestampsToDates(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;

  }

  return obj;
}

export const timestampToDateConverter: FirestoreDataConverter<any> = {
  toFirestore(modelObject) {
    // optionally convert dates back to timestamps on write
    return modelObject;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return convertTimestampsToDates(data);
  }
};


export function validCollection<T>(collectionPath: string) {
  return collection(db, collectionPath).withConverter(timestampToDateConverter);
}

export function docTo<T>(doc: DocumentSnapshot): T & { id: string } {
  return { id: doc.id, ...doc.data() } as T & { id: string };
}