import { addDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { Request } from "../../types/models";
import { createDoc, createDocWithCustomId, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../clientApp";

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
  };

export async function CreateNewRequest(request: Request) {
  const newRequest = {
    ...request,
    id: uuidv4(),
    createdAt: new Date(request.createdAt),
    startDate: new Date(request.startDate),
    endDate: new Date(request.endDate),
  };
  const docId = await createDocWithCustomId(collection, newRequest);
  return { ...newRequest, id: docId };
}