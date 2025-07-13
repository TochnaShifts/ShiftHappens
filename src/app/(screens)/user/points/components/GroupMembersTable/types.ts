export type Member = {
  userId: string;
  name: string;
  points: number;
  monthlyShifts: number;
  status: boolean;
};

export type Group = {
  groupId: string;
  groupName: string;
  members: Member[];
}; 