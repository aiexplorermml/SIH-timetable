export interface Room {
  id: string;
  name: string;
  number: string;
  type: 'classroom' | 'lab' | 'conference' | 'auditorium' | 'office' | 'library';
  capacity: number;
  floor: number;
  building: string;
  department: string;
  description?: string;
  amenities: string[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface RoomFormData {
  name: string;
  number: string;
  type: Room['type'];
  capacity: number;
  floor: number;
  building: string;
  department: string;
  description?: string;
  amenities: string[];
  status: Room['status'];
}

export interface RoomInfrastructure {
  id: string;
  roomId: string;
  infrastructureId: string;
  infrastructureName: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  assignedDate: string;
}