// CreateGroupModal.js
import axios from 'axios';
import { User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import config from '../../config';

const CreateGroupModal = ({
  onClose,
  onSuccess,
  mode = 'create', // 'create' or 'add'
  groupData = null, // Required for 'add' mode
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${config.backendURL}/api/accounts/users/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          },
        }
      );
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'create' && (!groupName.trim() || selectedUsers.length === 0))
      return;
    if (mode === 'add' && selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      let response;

      if (mode === 'create') {
        response = await axios.post(
          `${config.backendURL}/api/chat/groups/create/`,
          {
            name: groupName,
            members: selectedUsers.map((user) => user.id),
          },
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('authToken')}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${config.backendURL}/api/chat/groups/add_members/`,
          {
            group_id: groupData.id,
            users: selectedUsers.map((user) => user.id),
          },
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('authToken')}`,
            },
          }
        );
        window.location.reload();
      }

      onSuccess(response.data);
    } catch (error) {
      console.error(
        `Error ${mode === 'create' ? 'creating group' : 'adding members'}:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const getFilteredUsers = () => {
    if (mode === 'create') {
      return availableUsers.filter(
        (user) => !selectedUsers.some((u) => u.id === user.id)
      );
    }
    return availableUsers.filter(
      (user) => !groupData.members.includes(user.username)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {mode === 'create' ? 'Create New Group' : 'Add New Members'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {mode === 'create' && (
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700"
              >
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Members ({selectedUsers.length})
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedUsers.map((user) => (
                <span
                  key={user.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {user.first_name} {user.last_name}
                  <button
                    onClick={() => toggleUserSelection(user)}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members
            </label>
            {getFilteredUsers().map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserSelection(user)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
              >
                <User className="w-5 h-5 text-gray-400" />
                <span>
                  {user.first_name} {user.last_name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (mode === 'create' &&
                (!groupName.trim() || selectedUsers.length === 0)) ||
              (mode === 'add' && selectedUsers.length === 0)
            }
            className={`flex-1 px-4 py-2 rounded-lg ${
              isLoading ||
              (mode === 'create' &&
                (!groupName.trim() || selectedUsers.length === 0)) ||
              (mode === 'add' && selectedUsers.length === 0)
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading
              ? mode === 'create'
                ? 'Creating...'
                : 'Adding...'
              : mode === 'create'
              ? 'Create Group'
              : 'Add Members'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
