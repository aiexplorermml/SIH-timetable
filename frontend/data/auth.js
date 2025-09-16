// Authentication credentials for demo users
export const defaultCredentials = [
  { username: 'admin', password: 'admin', userType: 'admin' },
  { username: 'krishna', password: 'krishna', userType: 'hod' },
  { username: 'pavan', password: 'pavan', userType: 'hod-support' },
  { username: 'pradeep', password: 'pradeep', userType: 'faculty' },
  { username: 'swaroop', password: 'swaroop', userType: 'faculty' },
  { username: 'srikanth', password: 'srikanth', userType: 'faculty' },
  { username: 'priya', password: 'priya', userType: 'student' },
  { username: 'supriya', password: 'supriya', userType: 'student' },
  { username: 'mahi', password: 'mahi', userType: 'student' },
  { username: 'vidya', password: 'vidya', userType: 'student' }
];

// Role-based permissions
export const rolePermissions = {
  canViewAdmin: ['admin', 'hod'],
  canViewDepartments: ['admin', 'hod', 'hod-support', 'faculty'],
  canViewPublic: true // Everyone can see public sections
};