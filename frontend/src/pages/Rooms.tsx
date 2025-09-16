import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, Building } from 'lucide-react';
import { Room, RoomFormData } from '@/types/room';
import { classrooms } from '../../data/classrooms.js';

const roomTypes = [
  { value: 'classroom', label: 'Classroom' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'conference', label: 'Conference Room' },
  { value: 'auditorium', label: 'Auditorium' },
  { value: 'office', label: 'Office' },
  { value: 'library', label: 'Library' }
];

const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIML', 'AIDS'];

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>(classrooms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    number: '',
    type: 'classroom',
    capacity: 0,
    floor: 1,
    building: '',
    department: '',
    description: '',
    amenities: [],
    status: 'active'
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || filterType === 'all-types' || room.type === filterType;
    const matchesDepartment = !filterDepartment || filterDepartment === 'all-departments' || room.department === filterDepartment;
    
    return matchesSearch && matchesType && matchesDepartment;
  });

  const handleCreateRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setRooms([...rooms, newRoom]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;
    
    const updatedRooms = rooms.map(room =>
      room.id === editingRoom.id
        ? { ...room, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : room
    );
    
    setRooms(updatedRooms);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      type: 'classroom',
      capacity: 0,
      floor: 1,
      building: '',
      department: '',
      description: '',
      amenities: [],
      status: 'active'
    });
    setEditingRoom(null);
  };

  const startEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      floor: room.floor,
      building: room.building,
      department: room.department,
      description: room.description || '',
      amenities: room.amenities,
      status: room.status
    });
    setIsDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      classroom: Users,
      lab: Building,
      conference: Users,
      auditorium: Users,
      office: Building,
      library: Building
    };
    
    const Icon = icons[type as keyof typeof icons] || Building;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Rooms</h1>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  {roomTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter room name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Room ID</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      placeholder="Enter room ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="building">Building Name</Label>
                    <Input
                      id="building"
                      value={formData.building}
                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                      placeholder="Enter building name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                      placeholder="Enter capacity"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type of Room</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}>
                    {editingRoom ? 'Update' : 'Create'} Room
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Building Name</TableHead>
                    <TableHead>Room ID</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Type of Room</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(room.type)}
                          <span>{room.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{room.building}</TableCell>
                      <TableCell>{room.number}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell className="capitalize">{room.type}</TableCell>
                      <TableCell>{room.department}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditRoom(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}