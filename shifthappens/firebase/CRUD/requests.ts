import { Request } from "../../types/models";
import { createDoc, deleteDocById, getCollection, getDocById, updateDocById } from "../firestore-crud";

const collection = 'requests';

export const createRequest = (data: Request) => createDoc<Request>(collection, data);
export const getRequestById = (id: string) => getDocById<Request>(collection, id);
export const getAllRequests = () => getCollection<Request>(collection);
export const deleteRequest = (id: string) => deleteDocById(collection, id);