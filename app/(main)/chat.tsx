import { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Animated,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from 'react-native';
import { CustomText } from 'components/Text';
import { Ionicons } from '@expo/vector-icons';
import { colors } from 'theme/colors';
import { router } from 'expo-router';
import { Model, useChatStore } from 'store/chats/store';


export default function ChatPage() {
  const [message, setMessage] = useState('');
  const messages = useChatStore((state)=>state.selectedChatMessages)
  const setMessages = useChatStore((state)=>state.addChatMessage)
  const selectedChat = useChatStore((state)=>state.selectedChat)
  const models = useChatStore((state)=>state.models)
  const [selectedModel, setSelectedModel] = useState(models && models.filter((item)=>item?.id == selectedChat?.lastUsedModel)[0]);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(newMessage as any);
      setMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: `This is a response from ${selectedModel?.name}. I'm here to help you with your question!`,
          isUser: false,
          timestamp: new Date(),
          model: selectedModel?.name,
        };
        setMessages(aiResponse as any);
      }, 1000);
    }
  };

  const openModelSelector = () => {
    setModelModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeModelSelector = () => {
    Animated.spring(scaleAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setModelModalVisible(false);
    });
  };

  const selectModel = (model: Model) => {
    setSelectedModel(model);
    closeModelSelector();
  };

  const formatTime = (timestamp: Date) => {
    if(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Null'
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}>
      {!item.isUser && (
        <View style={styles.aiHeader}>
          <View style={[styles.modelBadge]}>
            <CustomText style={[styles.modelText]}>
              {selectedModel?.name}
            </CustomText>
          </View>
        </View>
      )}

      <View style={[styles.messageBubble, item.isUser ? styles.userMessage : styles.aiMessage]}>
        <CustomText
          style={[styles.messageText, item.isUser ? styles.userMessageText : styles.aiMessageText]}>
          {item.text}
        </CustomText>
      </View>

      <CustomText
        style={[styles.timestamp, item.isUser ? styles.userTimestamp : styles.aiTimestamp]}>
        {formatTime(item?.timestamp)}
      </CustomText>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <CustomText style={styles.headerTitle}>{selectedChat?.name}</CustomText>
          <TouchableOpacity
            onPress={openModelSelector}
            style={styles.modelSelector}
            activeOpacity={0.8}>
            <Image source={{ uri: selectedModel?.icon }} style={styles.modelIcon} />
            <CustomText style={styles.modelName}>{selectedModel?.name}</CustomText>
            <Ionicons name="chevron-down" size={16} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuButton} activeOpacity={0.8}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendButton, { backgroundColor: message.trim() ? '#4C63D2' : '#E5E7EB' }]}
            activeOpacity={0.8}
            disabled={!message.trim()}>
            <Ionicons name="send" size={20} color={message.trim() ? '#FFFFFF' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Model Selection Modal */}
      <Modal
        visible={modelModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModelSelector}>
        <Pressable style={styles.modalOverlay} onPress={closeModelSelector}>
          <ScrollView style={[styles.modelModal, ]}>
            <View style={styles.modalHeader}>
              <CustomText style={styles.modalTitle}>Select AI Model</CustomText>
              <TouchableOpacity onPress={closeModelSelector}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {models?.map((model, index) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelOption,
                  selectedModel?.id === model?.id && styles.selectedModelOption,
                ]}
                onPress={() => selectModel(model)}
                activeOpacity={0.8}>
                <Image source={{ uri: model?.icon }} style={styles.modelOptionIcon} />
                <View style={styles.modelInfo}>
                  <CustomText style={styles.modelOptionName}>{model.name}</CustomText>
                  {/* <CustomText style={styles.modelOptionDescription}>{model?.description}</CustomText> */}
                </View>
                {selectedModel?.id === model?.id && (
                  <Ionicons name="checkmark-circle" size={24}/>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar?.currentHeight ?? 0 + 20),
    paddingBottom: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modelIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginRight: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  aiHeader: {
    marginBottom: 4,
  },
  modelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  modelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#4C63D2',
    borderBottomRightRadius: 6,
  },
  aiMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  userTimestamp: {
    color: '#9CA3AF',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#9CA3AF',
    textAlign: 'left',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 8,
    maxHeight: 120,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  selectedModelOption: {
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#4C63D2',
  },
  modelOptionIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  modelInfo: {
    flex: 1,
  },
  modelOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  modelOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
});
