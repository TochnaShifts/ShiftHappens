import { TableRow, TableCell } from "@/app/components/loveable/table";
import { Badge } from "@/app/components/loveable/badge";
import { Member } from "./types";
import { getRankIcon } from "./utils";

interface GroupMemberRowProps {
  member: Member;
  index: number;
  currentUserId?: string;
}

const GroupMemberRow = ({ member, index, currentUserId }: GroupMemberRowProps) => (
  <TableRow
    className={member.userId === currentUserId ? "bg-blue-50" : ""}
  >
    <TableCell className="font-medium">
      <div className="flex items-center space-x-2 space-x-reverse">
        {getRankIcon(index + 1)}
        <span>#{index + 1}</span>
      </div>
    </TableCell>
    <TableCell
      className={
        member.userId === currentUserId
          ? "font-bold text-blue-600"
          : ""
      }
    >
      {member.name}
      {member.userId === currentUserId && (
        <span className="text-xs text-blue-500 mr-2">(אתה)</span>
      )}
    </TableCell>
    <TableCell>
      <Badge
        variant={
          member.userId === currentUserId
            ? "default"
            : "secondary"
        }
      >
        {member.points} נק'
      </Badge>
    </TableCell>
    <TableCell>{member.monthlyShifts}</TableCell>
    <TableCell>
      <Badge
        className={
          member.status
            ? "bg-green-100 text-green-700 hover:bg-green-100"
            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
        }
      >
        {member.status ? "פעיל" : "לא פעיל"}
      </Badge>
    </TableCell>
  </TableRow>
);

export default GroupMemberRow; 