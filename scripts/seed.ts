import {
  createUser,
  createGroup,
  createTemplate,
  createRequest,
  createShift,
  createShiftAssignment,
  createUserGroupPoints,
  createUserCategory,
} from '../src/app/shared/firebase/CRUD';
import { v4 as uuidv4 } from 'uuid';
import { Gender, MultiplierType, RequestType, AssignmentType } from '../src/app/shared/types/enums';
import { hashPassword } from '../src/app/shared/utils/hash';
import { getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../src/app/shared/firebase/clientApp';

const userCategoriesIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

async function seed() {
  async function clearCollection(collectionName: string) {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletes);
  }

  // Clear all collections
  await Promise.all([
    clearCollection('users'),
    clearCollection('groups'),
    clearCollection('shifts'),
    clearCollection('requests'),
    clearCollection('templates'),
    clearCollection('shiftAssignments'),
    clearCollection('userGroupPoints'),
    clearCollection('userCategories'),
  ]);

  // 1. User Categories (flags)
  const userCategories = [
    { id: userCategoriesIds[0], displayName: 'יכול לסחוב', pointsMultiplier: 1, multiplierType: MultiplierType.Shift, createdAt: new Date() },
    { id: userCategoriesIds[1], displayName: 'עושה שמירות יחידה', pointsMultiplier: 1, multiplierType: MultiplierType.User, createdAt: new Date() },
    { id: userCategoriesIds[2], displayName: 'עשה הגנם', pointsMultiplier: 1, multiplierType: MultiplierType.User, createdAt: new Date() },
    { id: userCategoriesIds[3], displayName: 'קבע', pointsMultiplier: 1.2, multiplierType: MultiplierType.User, createdAt: new Date() },
    { id: userCategoriesIds[4], displayName: 'יכול להיכנס למבנה', pointsMultiplier: 1, multiplierType: MultiplierType.User, createdAt: new Date() },
  ];
  await Promise.all(userCategories.map(createUserCategory));

  // Groups (same)
  const groupIds = [uuidv4(), uuidv4(), uuidv4()];
  const groups = [
    { id: groupIds[0], displayName: 'שמירות יחידה', hasPointsTracking: true, type: 'guard', createdAt: new Date() },
    { id: groupIds[1], displayName: 'שמירות מחנה', hasPointsTracking: true, type: 'guard', createdAt: new Date() },
    { id: groupIds[2], displayName: 'תורנויות', hasPointsTracking: true, type: 'toranut', createdAt: new Date() },
  ];
  await Promise.all(groups.map(createGroup));

  // 2. Users (12 users)
  const userIds = Array.from({ length: 12 }).map(() => uuidv4());

  const users = [
    {
      id: userIds[0],
      name: 'אורי יצחק',
      username: 'orii',
      password: await hashPassword('ori123'),
      isActive: true,
      isGlobalAdmin: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
      groups: [],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[1],
      name: 'אמיתי בן אהרון',
      username: 'amitayb',
      password: await hashPassword('amita123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
      groups: [
        { groupId: groupIds[1], isAdmin: false },
        { groupId: groupIds[2], isAdmin: false },
      ],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[2],
      name: 'תומר פרידלר',
      username: 'tomerF',
      password: await hashPassword('tomar123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
      groups: [{ groupId: groupIds[2], isAdmin: true }],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[3],
      name: 'אור אבנון',
      username: 'oraB',
      password: await hashPassword('orab123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
      groups: [
        { groupId: groupIds[0], isAdmin: true },
        { groupId: groupIds[2], isAdmin: true },
      ],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[4],
      name: 'נדב פסח',
      username: 'nadavP',
      password: await hashPassword('nadav123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
      groups: [
        { groupId: groupIds[0], isAdmin: false },
        { groupId: groupIds[2], isAdmin: false },
      ],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[5],
      name: 'נועה הרשקו',
      username: 'noaH',
      password: await hashPassword('noa123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
      groups: [
        { groupId: groupIds[0], isAdmin: false },
        { groupId: groupIds[2], isAdmin: false },
        { groupId: groupIds[1], isAdmin: false },
      ],
      gender: Gender.Female,
      totalPoints: 0,
      createdAt: new Date(),
    },
    // Add 6 more users with mixed group memberships and categories
    {
      id: userIds[6],
      name: 'רון כהן',
      username: 'ronC',
      password: await hashPassword('ron123'),
      isActive: true,
      userCategories: [userCategoriesIds[1], userCategoriesIds[3]],
      groups: [
        { groupId: groupIds[0], isAdmin: false },
        { groupId: groupIds[1], isAdmin: false },
      ],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[7],
      name: 'נועה לוי',
      username: 'noaL',
      password: await hashPassword('noal123'),
      isActive: true,
      userCategories: [userCategoriesIds[2], userCategoriesIds[4]],
      groups: [{ groupId: groupIds[2], isAdmin: false }],
      gender: Gender.Female,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[8],
      name: 'יוסי ברק',
      username: 'yossiB',
      password: await hashPassword('yossi123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[1]],
      groups: [{ groupId: groupIds[0], isAdmin: true }],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[9],
      name: 'מירי אביטל',
      username: 'miriA',
      password: await hashPassword('miri123'),
      isActive: true,
      userCategories: [userCategoriesIds[3], userCategoriesIds[4]],
      groups: [{ groupId: groupIds[1], isAdmin: false }],
      gender: Gender.Female,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[10],
      name: 'דוד אלון',
      username: 'davidA',
      password: await hashPassword('david123'),
      isActive: true,
      userCategories: [userCategoriesIds[0], userCategoriesIds[2]],
      groups: [{ groupId: groupIds[2], isAdmin: true }],
      gender: Gender.Male,
      totalPoints: 0,
      createdAt: new Date(),
    },
    {
      id: userIds[11],
      name: 'סיון רפאל',
      username: 'sivanR',
      password: await hashPassword('sivan123'),
      isActive: true,
      userCategories: [userCategoriesIds[1], userCategoriesIds[3]],
      groups: [
        { groupId: groupIds[0], isAdmin: false },
        { groupId: groupIds[2], isAdmin: false },
      ],
      gender: Gender.Female,
      totalPoints: 0,
      createdAt: new Date(),
    },
  ];
  await Promise.all(users.map(createUser));

  // 3. User Group Points for all user-group combos
  const userGroupPoints = users.flatMap((user) =>
    user.groups.map((g) => ({
      id: uuidv4(),
      userId: user.id,
      groupId: g.groupId,
      count: Math.floor(Math.random() * 100), // random points
      lastDate: new Date(Date.now() - Math.random() * 1000000000), // some random lastDate in past
    }))
  );
  await Promise.all(userGroupPoints.map(createUserGroupPoints));

  // 4. Templates
  const templates = [
    {
      id: uuidv4(),
      displayName: 'תורנות לחשופים',
      includedUserCategories: [userCategoriesIds[4]],
      excludedUserCategories: [],
      points: 1.0,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      displayName: 'תורנות סחיבה',
      includedUserCategories: [userCategoriesIds[0]],
      excludedUserCategories: [],
      points: 1.2,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      displayName: 'תורנות רגילה',
      includedUserCategories: [userCategoriesIds[0]],
      excludedUserCategories: [],
      points: 1.0,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      displayName: 'תורנות לילה',
      includedUserCategories: [userCategoriesIds[1]],
      excludedUserCategories: [],
      points: 1.3,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      displayName: 'תורנות חירום',
      includedUserCategories: [userCategoriesIds[2]],
      excludedUserCategories: [],
      points: 1.5,
      createdAt: new Date(),
    },
  ];
  await Promise.all(templates.map(createTemplate));

  // 5. Requests (5 requests)
  const requests = [
    {
      id: uuidv4(),
      userId: userIds[5],
      startDate: new Date(Date.now() + 1 * 86400000),
      endDate: new Date(Date.now() + 3 * 86400000),
      type: RequestType.Exclude,
      description: 'Family event',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      userId: userIds[7],
      startDate: new Date(Date.now() + 5 * 86400000),
      endDate: new Date(Date.now() + 7 * 86400000),
      type: RequestType.Prefer,
      description: 'Available for extra shifts',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      userId: userIds[1],
      startDate: new Date(Date.now() - 3 * 86400000),
      endDate: new Date(Date.now() - 1 * 86400000),
      type: RequestType.Exclude,
      description: 'Medical leave',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      userId: userIds[10],
      startDate: new Date(Date.now() + 2 * 86400000),
      endDate: new Date(Date.now() + 4 * 86400000),
      type: RequestType.Exclude,
      description: 'Vacation',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      userId: userIds[3],
      startDate: new Date(Date.now() + 10 * 86400000),
      endDate: new Date(Date.now() + 12 * 86400000),
      type: RequestType.Prefer,
      description: 'Can cover for shifts',
      createdAt: new Date(),
    },
  ];
  await Promise.all(requests.map(createRequest));

  // 6. Shifts (10 shifts)
  const shifts = [];

  for (let i = 0; i < 10; i++) {
    const groupId = groupIds[i % groupIds.length];
    const startDate = new Date(Date.now() + i * 2 * 3600 * 1000); // every 2 hours
    const endDate = new Date(startDate.getTime() + 2 * 3600 * 1000); // 2 hours shift
    const includedCategories = [userCategoriesIds[i % userCategoriesIds.length]];
    const excludedCategories: string[] = [];
    const usersForShift = users
      .filter((u) => u.groups.some((g) => g.groupId === groupId))
      .slice(0, 3) // max 3 users per shift
      .map((u) => u.id);
    const shift = {
      id: uuidv4(),
      groupId,
      displayName: `Shift ${i + 1} - Group ${groupId}`,
      startDate,
      endDate,
      includedUserCategories: includedCategories,
      excludedUserCategories: excludedCategories,
      users: usersForShift,
      points: 0.5 + i * 0.1,
      isFinished: false,
      createdAt: new Date(),
    };
    shifts.push(shift);
  }
  await Promise.all(shifts.map(createShift));

  // 7. Shift Assignments (one assignment per user for shifts)
  const shiftAssignments = [];
  for (const shift of shifts) {
    for (const userId of shift.users) {
      shiftAssignments.push({
        id: uuidv4(),
        userId,
        shiftId: shift.id,
        assignedBy: AssignmentType.Manual,
        assignedAt: new Date(),
        createdAt: new Date(),
      });
    }
  }
  await Promise.all(shiftAssignments.map(createShiftAssignment));
  console.log("Seeding complete")
}

seed().catch(console.error);
