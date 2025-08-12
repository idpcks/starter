'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { UserProfile, Role } from '@/types/auth';

// Mock user data
const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    image: 'https://ui-avatars.com/api/?name=Admin+User'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'USER',
    image: 'https://ui-avatars.com/api/?name=Regular+User'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
    image: 'https://ui-avatars.com/api/?name=John+Doe'
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'USER',
    image: 'https://ui-avatars.com/api/?name=Jane+Smith'
  },
];

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is admin, if not redirect
  if (session?.user?.role !== ('admin' as Role)) {
    redirect('/dashboard');
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
        setIsLoading(false);
      }, 500);
    }
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Edit user with ID: ${userId}`);
    // In a real app, this would open a modal or navigate to an edit page
  };

  const columns = [
    {
      header: 'User',
      accessor: (user: UserProfile) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} alt="" />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (user: UserProfile) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.role === ('admin' as Role) ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (user: UserProfile) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(user.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900"
            disabled={user.id === session?.user?.id}
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users and their permissions
          </p>
        </div>
        <Button
          onClick={() => toast.info('Add new user clicked')}
          className="flex items-center"
        >
          <FiUserPlus className="mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={users}
          keyField="id"
          isLoading={isLoading}
          emptyMessage="No users found"
        />
      </Card>
    </div>
  );
}