import React, { useState, useRef } from 'react';
import { User, UserRole, Gender } from '../types';
import { getString } from '../src/constants/i18n';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface UserManagementTableProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onSetUsers: (users: User[]) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onUpdateUser, onSetUsers }) => {
  const [editingCell, setEditingCell] = useState<{ userId: string; field: keyof User } | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    username: '',
    password: 'password',
    role: UserRole.JOB_SEEKER,
    email: '',
    phoneNumber: '',
    profile: {},
    employerProfile: {}
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.username} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCellEdit = (userId: string, field: keyof User, currentValue: string | undefined) => {
    setEditingCell({ userId, field });
    setEditingValue(currentValue || '');
  };

  const handleCellSave = () => {
    if (editingCell) {
      const user = users.find(u => u.id === editingCell.userId);
      if (user) {
        let updatedUser: User;
        
        if (editingCell.field === 'role') {
          updatedUser = { ...user, [editingCell.field]: editingValue as UserRole };
        } else {
          updatedUser = { ...user, [editingCell.field]: editingValue };
        }

        if (editingCell.field === 'firstName' || editingCell.field === 'lastName') {
          updatedUser.avatar = getUIAvatar(`${updatedUser.firstName} ${updatedUser.lastName}`, 128);
        }
        
        onUpdateUser(updatedUser);
      }
    }
    setEditingCell(null);
    setEditingValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      onSetUsers(updatedUsers);
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      const updatedUsers = users.filter(u => !selectedUsers.includes(u.id));
      onSetUsers(updatedUsers);
      setSelectedUsers([]);
    }
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.firstName || !newUser.lastName) {
      alert('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      username: newUser.username!,
      password: newUser.password || 'password',
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role || UserRole.JOB_SEEKER,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      profile: newUser.profile,
      employerProfile: newUser.employerProfile,
      language: 'ms'
    };

    const updatedUsers = [...users, user];
    onSetUsers(updatedUsers);
    setNewUser({
      firstName: '',
      lastName: '',
      username: '',
      password: 'password',
      role: UserRole.JOB_SEEKER,
      email: '',
      phoneNumber: '',
      profile: {},
      employerProfile: {}
    });
    setShowAddUser(false);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Username', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Gender', 'Major'];
    const rows = filteredUsers.map(user => [
      user.id,
      user.username,
      user.firstName,
      user.lastName,
      user.email || '',
      user.phoneNumber || '',
      user.role,
      user.profile?.gender || '',
      user.profile?.major || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const newUsers: User[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
        
        const user: User = {
          id: values[0] || `imported-${Date.now()}-${i}`,
          username: values[1] || `user${i}`,
          firstName: values[2] || '',
          lastName: values[3] || '',
          email: values[4] || '',
          phoneNumber: values[5] || '',
          role: values[6] as UserRole || UserRole.JOB_SEEKER,
          profile: { gender: values[7] as Gender, major: values[8] },
          language: 'ms'
        };
        
        newUsers.push(user);
      }
      
      if (confirm(`Import ${newUsers.length} users? This will add them to the existing database.`)) {
        onSetUsers([...users, ...newUsers]);
      }
    };
    reader.readAsText(file);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

return (
    <div className="space-y-8">
      {/* Enhanced Header Controls */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-purple-50 shadow-2xl space-y-6">
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
          <div className="flex-1 w-full xl:w-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                className="px-6 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100 min-w-[150px]"
              >
                <option value="all">All Roles</option>
                <option value={UserRole.JOB_SEEKER}>{getString('role_student')}</option>
                <option value={UserRole.EMPLOYER}>{getString('role_employer')}</option>
                <option value={UserRole.ADMIN}>{getString('role_admin')}</option>
                <option value={UserRole.OWNER}>{getString('role_owner')}</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-black text-sm hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-black text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-black text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              className="hidden"
            />
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

{/* Enhanced Add User Form */}
        {showAddUser && (
          <div className="border-t border-purple-100 pt-6">
            <h4 className="text-lg font-black text-slate-900 mb-4">Add New User</h4>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    className="px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    className="px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                  className="w-full px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100"
                >
                  <option value={UserRole.JOB_SEEKER}>{getString('role_student')}</option>
                  <option value={UserRole.EMPLOYER}>{getString('role_employer')}</option>
                  <option value={UserRole.ADMIN}>{getString('role_admin')}</option>
                  <option value={UserRole.OWNER}>{getString('role_owner')}</option>
                </select>
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 outline-none font-bold text-sm focus:ring-4 focus:ring-purple-100"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-black text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

{/* Enhanced Data Table */}
<div className="bg-white rounded-[2.5rem] border border-purple-50 shadow-2xl overflow-hidden">
        <div className="hidden lg:block">
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-purple-300"
                  />
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest">User Info</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest">Profile</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
<tbody className="divide-y divide-purple-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-purple-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-purple-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`} 
                           className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-110 transition" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-sm">{user.firstName} {user.lastName}</p>
                        <p 
                          className="text-[10px] text-purple-400 font-black uppercase tracking-widest cursor-pointer hover:text-purple-600"
                          onClick={() => handleCellEdit(user.id, 'username', user.username)}
                        >
                          {editingCell?.userId === user.id && editingCell?.field === 'username' ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCellSave();
                                if (e.key === 'Escape') handleCellCancel();
                              }}
                              className="px-2 py-1 bg-white border border-purple-300 rounded text-xs"
                              autoFocus
                            />
                          ) : (
                            `@${user.username}`
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p 
                        className="text-sm text-slate-600 cursor-pointer hover:text-purple-600"
                        onClick={() => handleCellEdit(user.id, 'email', user.email)}
                      >
                        {editingCell?.userId === user.id && editingCell?.field === 'email' ? (
                          <input
                            type="email"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCellSave();
                              if (e.key === 'Escape') handleCellCancel();
                            }}
                            className="px-2 py-1 bg-white border border-purple-300 rounded text-xs"
                            autoFocus
                          />
                        ) : (
                          user.email || 'No email'
                        )}
                      </p>
                      <p 
                        className="text-xs text-slate-400 cursor-pointer hover:text-purple-600"
                        onClick={() => handleCellEdit(user.id, 'phoneNumber', user.phoneNumber)}
                      >
                        {editingCell?.userId === user.id && editingCell?.field === 'phoneNumber' ? (
                          <input
                            type="tel"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCellSave();
                              if (e.key === 'Escape') handleCellCancel();
                            }}
                            className="px-2 py-1 bg-white border border-purple-300 rounded text-xs"
                            autoFocus
                          />
                        ) : (
                          user.phoneNumber || 'No phone'
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleCellEdit(user.id, 'role', user.role)}
                    >
                      {editingCell?.userId === user.id && editingCell?.field === 'role' ? (
                        <select
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={handleCellSave}
                          className="px-3 py-1 bg-white border border-purple-300 rounded text-xs font-black"
                          autoFocus
                        >
                          <option value={UserRole.JOB_SEEKER}>{getString('role_student')}</option>
                          <option value={UserRole.EMPLOYER}>{getString('role_employer')}</option>
                          <option value={UserRole.ADMIN}>{getString('role_admin')}</option>
                          <option value={UserRole.OWNER}>{getString('role_owner')}</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          user.role === UserRole.JOB_SEEKER ? 'bg-blue-100 text-blue-700' :
                          user.role === UserRole.EMPLOYER ? 'bg-green-100 text-green-700' :
                          user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {user.profile?.gender === Gender.MALE ? '\u2642\uFE0F' :
                           user.profile?.gender === Gender.FEMALE ? '\u2640\uFE0F' : '\u2753'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {user.profile?.gender || 'Not set'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {user.profile?.major || 'No major'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
</table>
        </div>

        {/* Mobile/Tablet View */}
        <div className="lg:hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border-b border-purple-50 hover:bg-purple-50/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-purple-300"
                    />
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`} 
                         className="w-10 h-10 rounded-xl object-cover shadow-md" alt="" />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">@{user.username}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                    user.role === UserRole.JOB_SEEKER ? 'bg-blue-100 text-blue-700' :
                    user.role === UserRole.EMPLOYER ? 'bg-green-100 text-green-700' :
                    user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Email</p>
                    <p className="text-slate-600 truncate">{user.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Phone</p>
                    <p className="text-slate-600">{user.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

{/* Enhanced Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-purple-50 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-lg">👥</div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
          <p className="text-2xl font-black text-slate-900 tabular-nums">{filteredUsers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-purple-50 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">✓</div>
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected</p>
          <p className="text-2xl font-black text-purple-600 tabular-nums">{selectedUsers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-purple-50 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">🎓</div>
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Students</p>
          <p className="text-2xl font-black text-blue-600 tabular-nums">{filteredUsers.filter(u => u.role === UserRole.JOB_SEEKER).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-purple-50 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">🏢</div>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Employers</p>
          <p className="text-2xl font-black text-green-600 tabular-nums">{filteredUsers.filter(u => u.role === UserRole.EMPLOYER).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-purple-50 shadow-xl hover:shadow-2xl transition-all hidden lg:block">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-lg">👑</div>
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admins</p>
          <p className="text-2xl font-black text-purple-600 tabular-nums">{filteredUsers.filter(u => u.role === UserRole.ADMIN || u.role === UserRole.OWNER).length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTable;