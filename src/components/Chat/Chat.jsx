// ChatApp.js
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import CreateGroupModal from './CreateGroupModel';

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const location = useLocation();
  const receiver = location.state?.receiver;

  useEffect(() => {
    if (receiver) {
      setSelectedUser(receiver);
      setSelectedGroup(null);
    }
  }, [receiver]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectChat = (user, group) => {
    setSelectedUser(user);
    setSelectedGroup(group);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const handleGroupCreated = (groupData) => {
    setShowCreateGroup(false);
    setSelectedGroup(groupData);
    setSelectedUser(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-row flex-grow overflow-hidden">
        <div
          className={`${
            isMobileView && (selectedUser || selectedGroup)
              ? 'hidden'
              : 'w-full md:w-1/3 lg:w-1/4'
          } transition-all duration-300 ease-in-out`}
        >
          <ChatList
            onSelectChat={handleSelectChat}
            selectedUser={selectedUser}
            selectedGroup={selectedGroup}
            onCreateGroup={() => setShowCreateGroup(true)}
            className="h-full"
          />
        </div>

        <div
          className={`${
            isMobileView && !selectedUser && !selectedGroup
              ? 'hidden'
              : 'flex-1'
          } transition-all duration-300 ease-in-out`}
        >
          <ChatWindow
            selectedUser={selectedUser}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            onBack={handleBack}
          />
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          mode="create"
          onClose={() => setShowCreateGroup(false)}
          onSuccess={handleGroupCreated}
        />
      )}
    </div>
  );
};

export default ChatApp;
