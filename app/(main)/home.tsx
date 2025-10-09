import { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { CustomText } from 'components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from 'store/chats/store';
import Header from 'components/Home(Chat)/Header';
import NewChatModal from 'components/Home(Chat)/NewChatModal';
import ChatList from 'components/Home(Chat)/ChatList';
import { api } from 'server/api';
import EmptyChatsState from 'components/Home(Chat)/ChatEmptyState';
import { useProfileStore } from 'store/profile/store';

export default function ChatListScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  // Settings modal state
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [settingsScaleAnim] = useState(new Animated.Value(0));
  const [settingsSlideAnim] = useState(new Animated.Value(-50));

  // Chat options modal state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const models = useChatStore((state) => state.models);
  const setModels = useChatStore((state) => state.setModels);
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);

  const user = useProfileStore((state)=>state.user)

  useEffect(() => {
    const loadModels = async () => {
      // if (models) return;
      const fetchedModels = await api.getFreeModels();
      if (fetchedModels) {
        setModels(fetchedModels);
      }
    };
    const loadChats = async () => {
      if(!user) return ;
      const fetchChats  = await api.getChats(user?.id)
      setChats(fetchChats)
    }
    loadChats();
    loadModels();
  }, []);

  const [newChatModalVisible, setNewChatModalVisible] = useState(false);
  const [newChatScaleAnim] = useState(new Animated.Value(0));

  const openOptions = (id: string) => {
    setSelectedChatId(id);
    setModalVisible(true);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const closeOptions = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(slideAnim, {
        toValue: -50,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedChatId(null);
    });
  };

  const openNewChatModal = () => {
    setNewChatModalVisible(true);
    Animated.spring(newChatScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeNewChatModal = () => {
    Animated.spring(newChatScaleAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setNewChatModalVisible(false);
    });
  };

  // Settings modal functions
  const openSettingsModal = () => {
    setSettingsModalVisible(true);
    Animated.parallel([
      Animated.spring(settingsScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(settingsSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const closeSettingsModal = () => {
    Animated.parallel([
      Animated.spring(settingsScaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(settingsSlideAnim, {
        toValue: -50,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start(() => {
      setSettingsModalVisible(false);
    });
  };

  // Delete all chats function
  const handleDeleteAllChats = () => {
    if (!user || !chats || chats.length === 0) return;

    Alert.alert(
      'Delete All Chats',
      `Are you sure you want to delete all ${chats.length} chats? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all chats from the server
              await api.deleteAllChats(user.id);
              // Clear chats from store
              setChats([]);
              closeSettingsModal();
              Alert.alert('Success', 'All chats have been deleted successfully.');
            } catch (error) {
              console.error('Error deleting all chats:', error);
              Alert.alert('Error', 'Failed to delete chats. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Delete single chat function
  const handleDeleteSingleChat = () => {
    if (!selectedChatId || !chats) return;

    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    if (!selectedChat) return;

    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete "${selectedChat.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete chat from the server
              await api.deleteChat(selectedChatId);
              // Remove chat from local state
              const updatedChats = chats.filter(chat => chat.id !== selectedChatId);
              setChats(updatedChats);
              closeOptions();
              Alert.alert('Success', `"${selectedChat.name}" has been deleted successfully.`);
            } catch (error) {
              console.error('Error deleting chat:', error);
              Alert.alert('Error', 'Failed to delete chat. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="F8FAFC" />
      <Header onSettingsPress={openSettingsModal} />

      {chats && chats.length > 0 ? (
        <ChatList chats={chats} openOptions={openOptions} />
      ) : (
        <EmptyChatsState onCreateChat={openNewChatModal} />
      )}

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={openNewChatModal}>
        <View style={styles.fabContent}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeOptions}>
        <Pressable style={styles.modalOverlay} onPress={closeOptions}>
          <Animated.View
            style={[
              styles.popup,
              {
                transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
              },
            ]}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                // Handle pin here
                closeOptions();
              }}
              activeOpacity={0.8}>
              <Ionicons name="pin-outline" size={20} color="#4C63D2" />
              <CustomText style={styles.modalOptionText}>Pin Chat</CustomText>
            </TouchableOpacity>

            <View style={styles.modalSeparator} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                // Handle mute here
                closeOptions();
              }}
              activeOpacity={0.8}>
              <Ionicons name="notifications-off-outline" size={20} color="#F59E0B" />
              <CustomText style={styles.modalOptionText}>Mute</CustomText>
            </TouchableOpacity>

            <View style={styles.modalSeparator} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeleteSingleChat}
              activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <CustomText style={[styles.modalOptionText, styles.deleteText]}>Delete</CustomText>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* New Chat Modal */}
      <NewChatModal
        closeNewChatModal={closeNewChatModal}
        newChatScaleAnim={newChatScaleAnim}
        models={models}
        newChatModalVisible={newChatModalVisible}
      />

      {/* Settings Modal */}
      <Modal visible={settingsModalVisible} transparent animationType="none" onRequestClose={closeSettingsModal}>
        <Pressable style={styles.modalOverlay} onPress={closeSettingsModal}>
          <Animated.View
            style={[
              styles.settingsPopup,
              {
                transform: [{ scale: settingsScaleAnim }, { translateY: settingsSlideAnim }],
              },
            ]}>
            {/* Header */}
            <View style={styles.settingsHeader}>
              <CustomText style={styles.settingsTitle}>Settings</CustomText>
              <TouchableOpacity onPress={closeSettingsModal} style={styles.settingsCloseButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Settings Options */}
            <View style={styles.settingsOptions}>
              <TouchableOpacity
                style={styles.settingsOption}
                onPress={() => {
                  closeSettingsModal();
                  // Handle export chats here
                }}
                activeOpacity={0.8}>
                <View style={styles.optionIconContainer}>
                  <Ionicons name="download-outline" size={20} color="#10B981" />
                </View>
                <CustomText style={styles.optionText}>Export Chats</CustomText>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>

              <View style={styles.settingsSeparator} />

              <TouchableOpacity
                style={styles.settingsOption}
                onPress={() => {
                  closeSettingsModal();
                  // Handle chat history here
                }}
                activeOpacity={0.8}>
                <View style={styles.optionIconContainer}>
                  <Ionicons name="time-outline" size={20} color="#6366F1" />
                </View>
                <CustomText style={styles.optionText}>Chat History</CustomText>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>

              <View style={styles.settingsSeparator} />

              <TouchableOpacity
                style={[styles.settingsOption, styles.dangerOption]}
                onPress={handleDeleteAllChats}
                activeOpacity={0.8}>
                <View style={[styles.optionIconContainer, styles.dangerIconContainer]}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </View>
                <CustomText style={[styles.optionText, styles.dangerText]}>Delete All Chats</CustomText>
                <View style={styles.chatCountBadge}>
                  <CustomText style={styles.chatCountText}>{chats?.length || 0}</CustomText>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63D2',
    // Ensure proper flex behavior on Android devices
    minHeight: 0,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabContent: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  deleteText: {
    color: '#EF4444',
  },
  // Settings Modal Styles
  settingsPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '85%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 15,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingsCloseButton: {
    padding: 4,
  },
  settingsOptions: {
    gap: 8,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dangerOption: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  dangerText: {
    color: '#EF4444',
  },
  chatCountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  chatCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
});