import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/loveable/card";
import { Users } from "lucide-react";
import { Select, SelectItem } from "@/app/components/loveable/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/loveable/table";
import { Button } from "@/app/components/loveable/button";
import GroupMemberRow from "./GroupMemberRow";
import { Group } from "./types";

interface GroupMembersTableProps {
  groupMembersPoints: Group[];
  currentUserId?: string;
}

const GroupMembersTable = ({
  groupMembersPoints,
  currentUserId,
}: GroupMembersTableProps) => {
  // Memoize group options for dropdown
  const groupOptions = useMemo(
    () =>
      groupMembersPoints.map((g) => ({
        groupId: g.groupId,
        groupName: g.groupName,
      })),
    [groupMembersPoints]
  );
  // State for selected group and showAllMembers
  const [selectedGroupId, setSelectedGroupId] = useState(
    groupOptions[0]?.groupId || ""
  );
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Find the selected group and its members
  const selectedGroup = groupMembersPoints.find(
    (g) => g.groupId === selectedGroupId
  );
  const groupMembers = selectedGroup ? selectedGroup.members : [];

  // Sort members by points descending
  const sortedMembers = [...groupMembers].sort((a, b) => b.points - a.points);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 ml-2 text-blue-600" />
              דירוג חברי הקבוצה
            </CardTitle>
            <CardDescription>נקודות וביצועים של חברי הקבוצה</CardDescription>
          </div>
          <Select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-48"
          >
            {groupOptions.map((group) => (
              <SelectItem key={group.groupId} value={group.groupId}>
                {group.groupName}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">דירוג</TableHead>
              <TableHead className="text-right">שם</TableHead>
              <TableHead className="text-right">נקודות</TableHead>
              <TableHead className="text-right">משמרות החודש</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers
              .slice(0, showAllMembers ? undefined : 5)
              .map((member, index) => (
                <GroupMemberRow
                  key={member.userId}
                  member={member}
                  index={index}
                  currentUserId={currentUserId}
                />
              ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            מציג{" "}
            {showAllMembers
              ? sortedMembers.length
              : Math.min(5, sortedMembers.length)}{" "}
            מתוך {sortedMembers.length} חברים
          </p>
          <Button
            variant="outline"
            onClick={() => setShowAllMembers(!showAllMembers)}
          >
            {showAllMembers ? "הצג פחות" : "צפה בכל החברים"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupMembersTable; 