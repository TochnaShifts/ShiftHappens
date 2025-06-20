import { Template } from "../../types/models";
import { createDoc, deleteDocById, getCollection, updateDocById } from "../firestore-crud";

const collection = 'templates';

export const createTemplate = (data: Template) => createDoc<Template>(collection, data);
export const getAllTemplates = () => getCollection<Template>(collection);
export const updateTemplate = (id: string, data: Partial<Template>) => updateDocById<Template>(collection, id, data);
export const deleteTemplate = (id: string) => deleteDocById(collection, id);