// src/components/admin/UserManagement/UserList.jsx
'use client';

import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

const UserList = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Handle sort functionality
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Client';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">Liste des utilisateurs</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9D5247] pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {filteredUsers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  Rôle {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Date d'inscription {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Voir l'utilisateur">
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button className="text-[#9D5247] hover:text-[#7d3f36]" title="Modifier l'utilisateur">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Supprimer l'utilisateur">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {searchTerm ? 
                `Aucun utilisateur ne correspond à "${searchTerm}"` : 
                'Aucun utilisateur trouvé'}
            </p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-700">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'utilisateur' : 'utilisateurs'} trouvé{filteredUsers.length === 1 ? '' : 's'}
        </div>
        <Link href="/admin/users/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#9D5247] hover:bg-[#7d3f36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9D5247]">
          Ajouter un utilisateur
        </Link>
      </div>
    </div>
  );
};

export default UserList;