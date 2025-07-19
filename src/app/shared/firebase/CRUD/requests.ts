import { addDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { Request } from "../../types/models";
import { createDoc, createDocWithCustomId, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";
import { validCollection } from "../../utils/firestoreConverters";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../clientApp";
import { getUsersByGroupId } from "./users";
import { User } from "../../types/models";

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

export async function getRequestsByGroupId(groupId: string): Promise<Request[]> {
  // First get all users in the group
  const groupUsers = await getUsersByGroupId(groupId);
  const userIds = groupUsers.map((user: User) => user.id);
  
  console.log(`Found ${userIds.length} users in group ${groupId} for requests`);
  
  if (userIds.length === 0) return [];
  
  // Then get all requests for these users
  const requestsRef = validCollection<Request>(collection);
  const q = query(
    requestsRef,
    where('userId', 'in', userIds)
  );
  
  const snapshot = await getDocs(q);
  
  const requests: Request[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    requests.push({
      id: doc.id,
      ...data
    } as Request);
  });
  
  console.log(`Found ${requests.length} requests for group ${groupId}`);
  return requests;
}

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