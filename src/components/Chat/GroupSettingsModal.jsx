// GroupSettingsModal.js
import axios from 'axios';
import { User, X } from 'lucide-react';
import { useState } from 'react';
import config from '../../config';

const GroupSettingsModal = ({ group, onClose, onUpdate }) => {
  const [groupName, setGroupName] = useState(group.name);
  const [members, setMembers] = useState(group.members);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateName = async () => {
    if (!groupName.trim() || groupName === group.name) return;

    setIsLoading(true);
    try {
      await axios.patch(
        `${config.backendURL}/api/chat/groups/${group.id}/update/`,
        { name: groupName },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        }
      );
      onUpdate({ ...group, name: groupName });
      alert('Group name updated successfully!');
    } catch (error) {
      alert('Failed to update group name');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (username) => {
    if (!window.confirm(`Remove ${username} from the group?`)) return;

    try {
      await axios.post(
        `${config.backendURL}/api/chat/groups/${group.id}/remove-member/`,
        { username },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setMembers(members.filter((member) => member !== username));
      onUpdate({
        ...group,
        members: members.filter((member) => member !== username),
      });
    } catch (error) {
      alert('Failed to remove member');
      console.error(error);
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const response = await axios.delete(
          `${config.backendURL}/api/chat/groups/delete_group/${group.id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('authToken')}`,
            },
          }
        );

        console.log(response.data.message); // Log success message
        alert('Group deleted successfully!'); // Show user feedback
        window.location.reload();
      } catch (error) {
        console.error(error.response?.data?.error || 'An error occurred');
        alert(error.response?.data?.error || 'Failed to delete the group');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Group Settings</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpdateName}
                disabled={
                  !groupName.trim() || groupName === group.name || isLoading
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                Update
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Members ({members.length})
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.map((username) => (
                <div
                  key={username}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{username}</span>
                  </div>
                  {username !== localStorage.getItem('username') && (
                    <button
                      onClick={() => handleRemoveMember(username)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex !mt-8 justify-end">
            <button
              onClick={handleDeleteGroup}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300"
            >
              Delete Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
