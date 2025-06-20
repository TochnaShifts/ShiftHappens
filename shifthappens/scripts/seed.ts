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
  } from '../firebase/CRUD';
  import { v4 as uuidv4 } from 'uuid';
  import { Gender, MultiplierType, RequestType, AssignmentType } from '../types/enums';

  
  async function seed() {
    // 1. Seed User Categories (flags)
    const userCategories = [
      { id: 'canLiftHeavy', displayName: 'יכול לסחוב', pointsMultiplier: 1, multiplierType: MultiplierType.Shift },
      { id: 'doesGuarding', displayName: 'עושה שמירות יחידה', pointsMultiplier: 1, multiplierType: MultiplierType.User },
      { id: 'completedHagnam', displayName: 'עשה הגנם', pointsMultiplier: 1, multiplierType: MultiplierType.User },
      { id: 'isKeva', displayName: 'קבע', pointsMultiplier: 1.2, multiplierType: MultiplierType.User },
      { id: 'canEnterOpStructure', displayName: 'Can Enter Operational Structure', pointsMultiplier: 1, multiplierType: MultiplierType.User },
    ];
    await Promise.all(userCategories.map(createUserCategory));
  
    // 2. Create Groups
    const groups = [
      { id: 'shmirotYehida', displayName: 'שמירות יחידה', hasPointsTracking: true, type: 'guard' },
      { id: 'shmirotMahane', displayName: 'שמירות מחנה', hasPointsTracking: true, type: 'guard' },
      { id: 'toranuyot', displayName: 'תורנויות', hasPointsTracking: true, type: 'toranut' },
    ];
    await Promise.all(groups.map(createGroup));
  
    // 3. Create Users
    const user1Id = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  
    const users = [
      {
        id: user1Id[0],
        name: 'אורי יצחק',
        username: 'orii',
        password: 'ori123',
        isActive: true,
        isGlobalAdmin: true,
        userCategories: ['canLiftHeavy', 'canEnterOpStructure', 'doesGuarding'],
        groups: [],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[1],
        name: 'אמיתי בן אהרון',
        username: 'amitayb',
        password: 'amita123',
        isActive: true,
        userCategories: ['canLiftHeavy', 'canEnterOpStructure', 'doesGuarding'],
        groups: [
          { groupId: 'shmirotMahane', isAdmin: false },
          { groupId: 'toranuyot', isAdmin: false },
        ],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[2],
        name: 'תומר פרידלר',
        username: 'tomerF',
        password: 'tomar123',
        isActive: true,
        userCategories: ['canLiftHeavy', 'canEnterOpStructure', 'doesGuarding'],
        groups: [
          { groupId: 'toranuyot', isAdmin: true },
        ],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[3],
        name: 'אור אבנון',
        username: 'oraB',
        password: 'orab123',
        isActive: true,
        userCategories: ['canLiftHeavy', 'canEnterOpStructure', 'doesGuarding'],
        groups: [
          { groupId: 'shmirotYehida', isAdmin: true },
          { groupId: 'toranuyot', isAdmin: true },
        ],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[4],
        name: 'נדב פסח',
        username: 'nadavP',
        password: 'nadav123',
        isActive: true,
        userCategories: ['canLiftHeavy', 'canEnterOpStructure', 'doesGuarding'],
        groups: [
          { groupId: 'shmirotYehida', isAdmin: false },
          { groupId: 'toranuyot', isAdmin: false },
        ],
        gender: Gender.Male,
        totalPoints: 0,
      },
      {
        id: user1Id[5],
        name: 'נועה הרשקו',
        username: 'noaH',
        password: 'noa123',
        isActive: true,
        userCategories: ['canLiftHeavy', 'canEnterOpStructure', 'doesGuarding'],
        groups: [
          { groupId: 'shmirotYehida', isAdmin: false },
          { groupId: 'toranuyot', isAdmin: false },
          { groupId: 'shmirotMahane', isAdmin: false },
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
        includedUserCategories: ['canEnterOpStructure'],
        excludedUserCategories: [],
        points: 1.0,
      },
      {
        id: uuidv4(),
        displayName: 'תורנות סחיבה',
        includedUserCategories: ['canLiftHeavy'],
        excludedUserCategories: [],
        points: 1.2,
      },
      {
        id: uuidv4(),
        displayName: 'תורנות רגילה',
        includedUserCategories: ['canLiftHeavy'],
        excludedUserCategories: [''],
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
        groupId: 'shmirotYehida',
        displayName: 'Night Guard Duty',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        includedUserCategories: ['canEnterOpStructure'],
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