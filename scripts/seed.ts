// Example Firestore seed script
import {
    createUser,
    createGroup,
    createTemplate,
    createRequest,
    createShift,
    createShiftAssignment,
    createUserGroupPoints,
    createUserCategory
  } from '../src/app/shared/firebase/CRUD';
  import { v4 as uuidv4 } from 'uuid';
  import { Gender, MultiplierType, RequestType, AssignmentType } from '../src/app/shared/types/enums';
  import { hashPassword } from '../src/app/shared/utils/hash';
  
  const userCategoriesIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

  async function seed() {
    // 1. Seed User Categories (flags)
    const userCategories = [
      { id: userCategoriesIds[0], displayName: 'יכול לסחוב', pointsMultiplier: 1, multiplierType: MultiplierType.Shift },
      { id: userCategoriesIds[1], displayName: 'עושה שמירות יחידה', pointsMultiplier: 1, multiplierType: MultiplierType.User },
      { id: userCategoriesIds[2], displayName: 'עשה הגנם', pointsMultiplier: 1, multiplierType: MultiplierType.User },
      { id: userCategoriesIds[3], displayName: 'קבע', pointsMultiplier: 1.2, multiplierType: MultiplierType.User },
      { id: userCategoriesIds[4], displayName: 'יכול להיכנס למבנה', pointsMultiplier: 1, multiplierType: MultiplierType.User },
    ];
    await Promise.all(userCategories.map(createUserCategory));
  
    const groupIds = [uuidv4(), uuidv4(), uuidv4()];
    // 2. Create Groups
    const groups = [
      { id: groupIds[0], displayName: 'שמירות יחידה', hasPointsTracking: true, type: 'guard' },
      { id: groupIds[1], displayName: 'שמירות מחנה', hasPointsTracking: true, type: 'guard' },
      { id: groupIds[2], displayName: 'תורנויות', hasPointsTracking: true, type: 'toranut' },
    ];
    await Promise.all(groups.map(createGroup));
  
    // 3. Create Users
    const user1Id = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  
    const users = [
      {
        id: user1Id[0],
        name: 'אורי יצחק',
        username: 'orii',
        password: await hashPassword('ori123'),
        isActive: true,
        isGlobalAdmin: true,
        userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
        groups: [],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[1],
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
      },
      {
        id: user1Id[2],
        name: 'תומר פרידלר',
        username: 'tomerF',
        password: await hashPassword('tomar123'),
        isActive: true,
        userCategories: [userCategoriesIds[0], userCategoriesIds[4], userCategoriesIds[2]],
        groups: [
          { groupId: groupIds[2], isAdmin: true },
        ],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[3],
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
      },
      {
        id: user1Id[4],
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
      },
      {
        id: user1Id[5],
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
      },
    ];
    await Promise.all(users.map(createUser));
  

    // 4. User Group Points
    // 4. Create UserGroupPoints (example per group per user)
  const userGroupPoints = users.flatMap((user) =>
    user.groups.map((g) => ({
      id: uuidv4(),
      userId: user.id,
      groupId: g.groupId,
      count: 0,
      lastDate: new Date().toISOString(),
    }))
  );
  await Promise.all(userGroupPoints.map(createUserGroupPoints));

    // 5. Templates
    const templates = [
      {
        id: uuidv4(),
        displayName: 'תורנות לחשופים',
        includedUserCategories: [userCategoriesIds[4]],
        excludedUserCategories: [],
        points: 1.0,
      },
      {
        id: uuidv4(),
        displayName: 'תורנות סחיבה',
        includedUserCategories: [userCategoriesIds[0]],
        excludedUserCategories: [],
        points: 1.2,
      },
      {
        id: uuidv4(),
        displayName: 'תורנות רגילה',
        includedUserCategories: [userCategoriesIds[0]],
        excludedUserCategories: [],
        points: 1.0,
      },
    ];
    await Promise.all(templates.map(createTemplate));
  
    // 6. Requests
    const requests = [
      {
        id: uuidv4(),
        userId: user1Id[5],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        type: RequestType.Exclude,
        description: 'Family event',
      },
    ];
    await Promise.all(requests.map(createRequest));
  
    // 7. Shifts
    const shift1Id = uuidv4();
    const shifts = [
      {
        id: shift1Id,
        groupId: groupIds[0],
        displayName: 'Night Guard Duty',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        includedUserCategories: [userCategoriesIds[4]],
        excludedUserCategories: [],
        users: [user1Id[5]],
        points: 0.6,
        isFinished: false,
      },
    ];
    await Promise.all(shifts.map(createShift));
  
    // 8. Shift Assignments
    const assignments = user1Id.map((id) => ({
      id: uuidv4(),
      shiftId: shift1Id,
      userId: id,
      assignedBy: AssignmentType.Auto,
      assignedAt: new Date().toISOString(),
    }));
    await Promise.all(assignments.map(createShiftAssignment));
  
    console.log('✅ Seeding complete');
  }
  
  console.log(createShiftAssignment)
  console.log(MultiplierType);
  seed().catch(console.error);