import { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  StatusBar,
  StyleSheet,
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

  const models = useChatStore((state) => state.models);
  const setModels = useChatStore((state) => state.setModels);
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);

  const user = useProfileStore((state)=>state.user)

  useEffect(() => {
    const loadModels = async () => {
      if (models) return;
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Header />

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
              onPress={() => {
                // Handle delete here
                closeOptions();
              }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63D2',
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
    backgroundColor: 'black',
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
});