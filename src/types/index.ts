export interface Student {
  $id: string;
  studentId: string;
  name: string;
  branch?: string;
  checkedIn: boolean;
  foodCollected: boolean;
  checkInTime?: string;
  foodTime?: string;
}

export interface StatsData {
  totalRegistered: number;
  checkedIn: number;
  foodCollected: number;
  pending: number;
}
