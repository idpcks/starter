'use client';

import { useSession } from 'next-auth/react';
import Card from '@/components/ui/Card';
import { FiUsers, FiActivity, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    {
      name: 'Total Users',
      value: '120',
      icon: FiUsers,
      change: '+5.4%',
      changeType: 'increase',
    },
    {
      name: 'Active Sessions',
      value: '42',
      icon: FiActivity,
      change: '+2.2%',
      changeType: 'increase',
    },
    {
      name: 'Completed Tasks',
      value: '89%',
      icon: FiCheckCircle,
      change: '+12.5%',
      changeType: 'increase',
    },
    {
      name: 'System Errors',
      value: '2',
      icon: FiAlertCircle,
      change: '-18.3%',
      changeType: 'decrease',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session?.user?.name || 'User'}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-50 p-3">
                <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {stat.changeType === 'increase' ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                <span>{stat.change} from last month</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Recent Activity">
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiActivity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Task completed</p>
                <p className="text-sm text-gray-500">3 hours ago</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FiAlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">System update</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button className="rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <FiUsers className="h-6 w-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">Add, edit or remove users</p>
            </button>
            <button className="rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <FiActivity className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500 mt-1">Access analytics and reports</p>
            </button>
            <button className="rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <FiCheckCircle className="h-6 w-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Create Task</p>
              <p className="text-xs text-gray-500 mt-1">Add new tasks to the system</p>
            </button>
            <button className="rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <FiAlertCircle className="h-6 w-6 text-red-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">System Settings</p>
              <p className="text-xs text-gray-500 mt-1">Configure system preferences</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}