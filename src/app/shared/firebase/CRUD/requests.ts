import { getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { Request } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";

const collection = 'requests';

export const createRequest = (data: Request) => createDoc<Request>(collection, data);
export const getRequestById = (id: string) => getDocById<Request>(collection, id);
export const getAllRequests = () => getCollection<Request>(collection);
export const deleteRequest = (id: string) => deleteDocById(collection, id);

export async function getRequestsByUserId(userId: string): Promise<Request[]> {
    const requestsRef = validCollection<Request>(collection)
    const q = query(
        requestsRef,
        where('userId', '==', userId)
    )

    const snapshot = await getDocs(q);

    const requests: Request[] = []
    snapshot.forEach(doc => {
        const data = doc.data()
        requests.push({
            id: doc.id,
            ...data
        } as Request)
    })

    return requests
  }