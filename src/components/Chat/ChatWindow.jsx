import axios from 'axios';
import {
  ArrowLeft,
  Eraser,
  Image,
  Mic,
  Send,
  UploadCloud,
  User,
  UserPlus,
  Video,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import CreateGroupModal from './CreateGroupModel';
import GroupSettingsModal from './GroupSettingsModal';

const ChatWindow = ({
  selectedUser,
  selectedGroup,
  onBack,
  setSelectedGroup,
}) => {
  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id');
  const user_fullName = localStorage.getItem('fullName');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [prevMessageCount, setPrevMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch messages when selectedUser or selectedGroup changes
  useEffect(() => {
    let interval;
    if (selectedUser || selectedGroup) {
      fetchMessages();
      interval = setInterval(fetchMessages, 2000);
    }

    return () => clearInterval(interval);
  }, [selectedUser, selectedGroup]);

  // Scroll to the bottom when new messages are received
  useEffect(() => {
    if (messages.length > prevMessageCount) {
      scrollToBottom();
    }
    setPrevMessageCount(messages.length);
  }, [messages]);

  // Clean up media preview when component unmounts
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const fetchMessages = () => {
    let endpoint;
    if (selectedGroup) {
      endpoint = `${config.backendURL}/api/chat/group-messages/${selectedGroup.id}/`;
    } else if (selectedUser) {
      endpoint = `${config.backendURL}/api/chat/messages/${selectedUser.id}/`;
    }

    if (endpoint) {
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`
          },
        })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => console.error('Error fetching messages:', error));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit');
      return;
    }

    setSelectedMedia(file);
    setMediaType(file.type.split('/')[0]); // 'image', 'video', or 'audio'

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
  };

  const handleMediaButtonClick = (type) => {
    setShowMediaOptions(false);

    // Set accepted file types based on the button clicked
    let acceptedTypes;
    switch (type) {
      case 'image':
        acceptedTypes = 'image/*';
        break;
      case 'audio':
        acceptedTypes = 'audio/*';
        break;
      case 'video':
        acceptedTypes = 'video/*';
        break;
      default:
        acceptedTypes = '*/*';
    }

    // Update file input's accept attribute and trigger click
    fileInputRef.current.accept = acceptedTypes;
    fileInputRef.current.click();
  };

  const removeSelectedMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedMedia) || isLoading) return;

    setIsLoading(true);
    try {
      let endpoint;
      let payload;
      let headers = {
        Authorization: `Token ${localStorage.getItem('authToken')}`,
      };

      // Create FormData for media upload
      const formData = new FormData();

      if (selectedGroup) {
        formData.append('group', selectedGroup.id);
        endpoint = `${config.backendURL}/api/chat/group-message/send/`;
      } else if (selectedUser) {
        formData.append('receiver', selectedUser.id);
        endpoint = `${config.backendURL}/api/chat/send/`;
      }

      // Add text message if it exists
      if (newMessage.trim()) {
        formData.append('message', newMessage);
      }

      // Add media file if it exists
      if (selectedMedia) {
        formData.append('media_file', selectedMedia);
        formData.append('media_type', mediaType);
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
      removeSelectedMedia();
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
      try {
        const endpoint = selectedUser
          ? `${config.backendURL}/api/chat/clear_chat/${selectedUser.id}/`
          : `${config.backendURL}/api/chat/clear_chat/${selectedGroup.id}/`;

        const response = await axios.post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setMessages([]);
        alert(response.data.message);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  const handleAddMembers = (response) => {
    alert(response.message);
    setShowAddMember(false);
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;

    try {
      await axios.post(
        `${config.backendURL}/api/chat/groups/${selectedGroup.id}/leave/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        }
      );
      alert('You have left the group');
      onBack();
    } catch (error) {
      alert('Failed to leave the group');
      console.error(error);
    }
  };

  const handleGroupUpdate = (updatedGroup) => {
    setSelectedGroup(updatedGroup);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Update the renderMediaContent function to optimize for Cloudinary
  const renderMediaContent = (message) => {
    if (!message.media_url) return null;

    // Cloudinary URLs can be modified with parameters for optimization
    const optimizeCloudinaryUrl = (url, mediaType) => {
      if (!url.includes('cloudinary.com')) return url;

      // Base transformations for different media types
      switch (mediaType) {
        case 'image':
          // Add quality and responsive parameters
          return url.replace(
            '/upload/',
            '/upload/q_auto,f_auto,w_auto,c_limit,h_300/'
          );
        case 'video':
          // Add video optimization parameters
          return url.replace('/upload/', '/upload/q_auto,f_auto/');
        case 'audio':
          // Audio doesn't need visual optimization
          return url;
        default:
          return url;
      }
    };

    switch (message.media_type) {
      case 'image':
        return (
          <img
            src={optimizeCloudinaryUrl(message.media_url, 'image')}
            alt="Image"
            className="max-w-full rounded-lg max-h-64 object-contain my-2"
            onClick={() => window.open(message.media_url, '_blank')}
            loading="lazy"
          />
        );
      case 'video':
        return (
          <video
            controls
            className="max-w-full rounded-lg max-h-64 my-2"
            preload="metadata"
          >
            <source
              src={optimizeCloudinaryUrl(message.media_url, 'video')}
              type={message.media_content_type}
            />
            Your browser does not support video playback.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="max-w-full my-2" preload="metadata">
            <source src={message.media_url} type={message.media_content_type} />
            Your browser does not support audio playback.
          </audio>
        );
      default:
        return (
          <a
            href={message.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download attachment
          </a>
        );
    }
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
        <User className="w-16 h-16 text-gray-300" />
        <p className="text-lg">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="md:hidden mr-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <button
              onClick={() =>
                selectedGroup
                  ? setShowGroupSettings(true)
                  : navigate(`/userprofile/${selectedUser.id}`)
              }
              className="text-left hover:opacity-75"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedGroup
                  ? selectedGroup.name
                  : `${selectedUser.first_name} ${selectedUser.last_name}`}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedGroup
                  ? `${selectedGroup.members.length} members`
                  : `@${selectedUser.username}`}
              </p>
            </button>
          </div>
          {selectedGroup ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddMember(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Add member"
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLeaveGroup}
                className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm"
              >
                Leave
              </button>
            </div>
          ) : (
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Clear chat"
            >
              <Eraser className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex !mt-0 ${
              msg.sender == user_id || msg.fullname == user_fullName
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] group ${
                msg.sender == user_id || msg.fullname == user_fullName
                  ? 'items-end'
                  : 'items-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender == user_id || msg.fullname == user_fullName
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {selectedGroup && msg.fullname != user_fullName && (
                  <p className="text-xs text-gray-500 mb-1">{msg.fullname}</p>
                )}
                {msg.message && <p className="text-sm">{msg.message}</p>}
                {renderMediaContent(msg)}
              </div>
              <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Media preview area */}
      {mediaPreview && (
        <div className="px-4 pb-2 bg-white border-t border-gray-200">
          <div className="relative inline-block border rounded-lg p-2 mt-2">
            <button
              onClick={removeSelectedMedia}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
            {mediaType === 'image' && (
              <img
                src={mediaPreview}
                alt="Preview"
                className="h-20 object-contain"
              />
            )}
            {mediaType === 'video' && (
              <video src={mediaPreview} className="h-20" controls />
            )}
            {mediaType === 'audio' && (
              <audio src={mediaPreview} className="h-10 w-40" controls />
            )}
          </div>
        </div>
      )}

      <div className="flex items-center p-4 bg-white border-t border-gray-200">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Media options dropdown */}
        <div className="relative mr-2">
          <button
            onClick={() => setShowMediaOptions(!showMediaOptions)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <UploadCloud className="w-5 h-5" />
          </button>

          {showMediaOptions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 flex flex-col space-y-2">
              <button
                onClick={() => handleMediaButtonClick('image')}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Image className="w-5 h-5 text-blue-500" />
                <span>Image</span>
              </button>
              <button
                onClick={() => handleMediaButtonClick('video')}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Video className="w-5 h-5 text-red-500" />
                <span>Video</span>
              </button>
              <button
                onClick={() => handleMediaButtonClick('audio')}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Mic className="w-5 h-5 text-green-500" />
                <span>Audio</span>
              </button>
            </div>
          )}
        </div>

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="1"
          className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
          disabled={isLoading || (!newMessage.trim() && !selectedMedia)}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {showGroupSettings && (
        <GroupSettingsModal
          group={selectedGroup}
          onClose={() => setShowGroupSettings(false)}
          onUpdate={handleGroupUpdate}
        />
      )}

      {showAddMember && (
        <CreateGroupModal
          mode="add"
          groupData={selectedGroup}
          onClose={() => setShowAddMember(false)}
          onSuccess={handleAddMembers}
        />
      )}
      {/* Add padding at the bottom when bottom navbar is visible */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default ChatWindow;
