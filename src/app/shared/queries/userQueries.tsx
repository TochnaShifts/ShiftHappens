import { getGroupsByIds } from "../firebase/CRUD/groups";
import { Group, User, UserCategory } from "../types";
import { getUserCategoriesByIds } from "../firebase/CRUD/userCategories";

export const fetchUserGroups = async (user: User) =>
  getGroupsByIds(user.groups.map((g) => g.groupId)).then((groups) =>
    groups.filter((g): g is Group => g !== null)
  );

export const fetchAdminGroups = async (user: User) =>
  getGroupsByIds(
    user.groups.filter((g) => g.isAdmin).map((g) => g.groupId)
  ).then((groups) => groups.filter((g): g is Group => g !== null));

export const fetchUserCategories = async (user: User) =>
  getUserCategoriesByIds(user.userCategories).then((categories) =>
    categories.filter((c): c is UserCategory => c !== null)
  );
