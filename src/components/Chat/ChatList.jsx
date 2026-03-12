// ChatList.js
import axios from 'axios';
import { Plus, Search, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import config from '../../config';

const ChatList = ({
  onSelectChat,
  selectedUser,
  selectedGroup,
  onCreateGroup,
  className,
}) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'groups'

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = () => {
    axios
      .get(`${config.backendURL}/api/accounts/users/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  };

  const fetchGroups = () => {
    axios
      .get(`${config.backendURL}/api/chat/groups/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`
        },
      })
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => console.error('Error fetching groups:', error));
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`${className} bg-white border-r border-gray-200 h-full flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              activeTab === 'direct'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              activeTab === 'groups'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'groups' && (
          <button
            onClick={onCreateGroup}
            className="w-full p-4 flex items-center text-blue-500 hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Group
          </button>
        )}

        <ul className="divide-y divide-gray-100">
          {activeTab === 'direct'
            ? filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => onSelectChat(user, null)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-3">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{user.username}
                    </p>
                  </div>
                </li>
              ))
            : filteredGroups.map((group) => (
                <li
                  key={group.id}
                  onClick={() => onSelectChat(null, group)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    selectedGroup?.id === group.id
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-3">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {group.members.length} members
                    </p>
                  </div>
                </li>
              ))}
        </ul>
      </div>
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default ChatList;
