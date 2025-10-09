import React, { useState, useRef, useEffect } from 'react';
import EventSource from 'react-native-sse';

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
  Alert,
} from 'react-native';
import { CustomText } from 'components/Text';
import { Ionicons } from '@expo/vector-icons';
import { colors } from 'theme/colors';
import { router } from 'expo-router';
import { Model, useChatStore } from 'store/chats/store';
import { api, apiUrl } from 'server/api';
import { useProfileStore } from 'store/profile/store';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messages = useChatStore((state) => state.selectedChatMessages);
  const setMessages = useChatStore((state) => state.setSelectedChatMessages);
  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const models = useChatStore((state) => state.models);
  const [selectedModel, setSelectedModel] = useState(
    models?.find((item) => item.id === selectedChat?.lastUsedModel) || null
  );

  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadChat = async () => {
      const messages = await api.getMessages(selectedChat?.id as string);
      setMessages(messages);
      setMessage('');
      setIsLoading(false);
    };
    loadChat();
  }, [selectedChat]);

  const user = useProfileStore((state) => state.user);

  // Add this UUID generator function at the top of your file or in a utils file
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Typing animation component
  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animateDots = () => {
        const animationSequence = [
          Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot1, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0, duration: 400, useNativeDriver: true }),
        ];

        Animated.loop(Animated.stagger(200, animationSequence), { iterations: -1 }).start();
      };

      animateDots();
    }, []);

    return (
      <View style={styles.typingIndicator}>
        <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
        <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
      </View>
    );
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    if (!selectedChat || !selectedModel || !user) return;

    try {
      const userMessage = message.trim();
      setMessage('');
      setIsLoading(true);

      // ─── User Message ───────────────────────────────
      const userMessageObj = {
        id: generateUUID(),
        text: userMessage,
        content: userMessage,
        userId: user?.id,
        messageType: 'user',
        chatId: selectedChat?.id,
        model: selectedModel?.id,
        createdAt: new Date().toISOString(),
      };

      addChatMessage(userMessageObj);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // ─── Prepare API Messages (last 20) ─────────────
      const apiMessages = messages
        ?.concat([userMessageObj])
        .slice(-20)
        .map((msg) => ({
          role: msg.messageType === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

      const requestBody = {
        messages: apiMessages,
        model: selectedModel?.id,
        chatId: selectedChat?.id,
        userId: user.id,
        messageType: 'user',
        content: userMessage,
      };

      let assistantMessageId: any = null;
      let accumulatedText = '';
      let assistantMessageCreated = false; // 🟢 Prevent duplicates
      let eventSource: any = null;

      // ─── Open SSE ──────────────────────────────────
      eventSource = new EventSource(`${apiUrl}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestBody),
      });

      // ─── message_id Event ──────────────────────────
      eventSource.addEventListener('message_id', (event: any) => {
        try {
          const data = JSON.parse(event.data);

          if (!assistantMessageCreated) {
            assistantMessageId = data.messageId;

            const assistantMessageObj = {
              id: assistantMessageId,
              text: '',
              content: '', // start empty (typing animation can show here)
              messageType: 'assistant',
              chatId: selectedChat?.id,
              model: selectedModel?.id,
              userId: user.id,
              createdAt: new Date().toISOString(),
            };

            addChatMessage(assistantMessageObj);
            assistantMessageCreated = true; // 🟢 Only once
          }
        } catch (parseError) {
          console.error('Error parsing message_id:', parseError);
        }
      });

      // ─── content Event ─────────────────────────────
      eventSource.addEventListener('content', (event: any) => {
        try {
          const data = JSON.parse(event.data);

          if (assistantMessageId && data.content) {
            accumulatedText += data.content;

            updateMessage(assistantMessageId, { content: accumulatedText });

            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 50);
          }
        } catch (parseError) {
          console.error('Error parsing content:', parseError);
        }
      });

      // ─── complete Event ────────────────────────────
      eventSource.addEventListener('complete', () => {
        eventSource.close();
        setIsLoading(false);
      });

      // ─── error Event ───────────────────────────────
      eventSource.addEventListener('error', (event: any) => {
        console.error('SSE error:', event);
        if (eventSource) eventSource.close();

        if (assistantMessageId) {
          updateMessage(assistantMessageId, {
            content:
              accumulatedText || '⚠️ Sorry, I encountered an error. Please try another model.',
          });
        } else {
          const errorMessageObj = {
            id: generateUUID(),
            text: '⚠️ Sorry, I encountered an error. Please try another model.',
            content: '⚠️ Sorry, I encountered an error. Please try another model.',
            messageType: 'assistant',
            chatId: selectedChat?.id,
            model: selectedModel?.id,
            userId: user.id,
            error: true,
            createdAt: new Date().toISOString(),
          };
          addChatMessage(errorMessageObj);
        }

        setIsLoading(false);
      });

      // ─── Timeout Safeguard ─────────────────────────
      const timeout = setTimeout(() => {
        if (eventSource) {
          eventSource.close();
          if (assistantMessageId) {
            updateMessage(assistantMessageId, {
              content: accumulatedText || '⚠️ Response timeout. Please try again.',
            });
          }
          setIsLoading(false);
        }
      }, 60000);

      // Cleanup
      const originalClose = eventSource.close;
      eventSource.close = function () {
        clearTimeout(timeout);
        originalClose.call(this);
      };
    } catch (error: any) {
      console.error('Error in sendMessage:', error);

      const errorMessageObj = {
        id: generateUUID(),
        text: '⚠️ Sorry, I encountered an error. Please try another model.',
        content: '⚠️ Sorry, I encountered an error. Please try another model.',
        messageType: 'assistant',
        chatId: selectedChat?.id,
        model: selectedModel?.id,
        userId: user.id,
        error: true,
        createdAt: new Date().toISOString(),
      };
      addChatMessage(errorMessageObj);

      Alert.alert('Error', `Failed to send message: ${error.message}`, [{ text: 'OK' }]);
      setIsLoading(false);
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

  const formatTime = React.useCallback((timestamp: Date) => {
    if (timestamp) {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '';
  }, []);

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isUser = item.messageType === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}>
        {!isUser && (
          <View style={styles.aiHeader}>
            <View style={styles.aiAvatarContainer}>
              <Image
                source={{ uri: models?.find((data) => data.id === item.model)?.icon || undefined }}
                style={styles.aiAvatar}
              />
            </View>
            <View style={styles.modelBadge}>
              <CustomText style={styles.modelText}>{item?.model}</CustomText>
            </View>
          </View>
        )}

        <View style={[styles.messageBubble, isUser ? styles.userMessage : styles.aiMessage]}>
          {item.content ? (
            <CustomText
              style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
              {item.content}
            </CustomText>
          ) : !isUser && !item.error ? (
            <TypingIndicator />
          ) : null}
        </View>

        <View
          style={[
            styles.messageFooter,
            isUser ? styles.userMessageFooter : styles.aiMessageFooter,
          ]}>
          <CustomText style={styles.timestamp}>{formatTime(item?.createdAt)}</CustomText>
          {isUser && (
            <Ionicons name="checkmark-done" size={16} color="#4C63D2" style={styles.readStatus} />
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

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
        {messages && messages.length > 0 ? (
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
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIconContainer}>
              <Ionicons name="chatbubbles-outline" size={80} color="#D1D5DB" />
            </View>
            <CustomText style={styles.emptyStateTitle}>Start a conversation</CustomText>
            <CustomText style={styles.emptyStateSubtitle}>
              Ask me anything! I'm here to help with questions, creative tasks, analysis, and more.
            </CustomText>

            <View style={styles.suggestionsContainer}>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => setMessage('What can you help me with?')}
                activeOpacity={0.7}>
                <Ionicons name="help-circle-outline" size={18} color="#4C63D2" />
                <CustomText style={styles.suggestionText}>What can you help me with?</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => setMessage('Write a creative story')}
                activeOpacity={0.7}>
                <Ionicons name="create-outline" size={18} color="#4C63D2" />
                <CustomText style={styles.suggestionText}>Write a creative story</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => setMessage('Explain a complex topic')}
                activeOpacity={0.7}>
                <Ionicons name="school-outline" size={18} color="#4C63D2" />
                <CustomText style={styles.suggestionText}>Explain a complex topic</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => setMessage('Help me brainstorm ideas')}
                activeOpacity={0.7}>
                <Ionicons name="bulb-outline" size={18} color="#4C63D2" />
                <CustomText style={styles.suggestionText}>Help me brainstorm ideas</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            multiline
            maxLength={1000}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              {
                backgroundColor: message?.trim() && !isLoading ? '#4C63D2' : '#E5E7EB',
              },
            ]}
            activeOpacity={0.8}
            disabled={!message?.trim() || isLoading}>
            {isLoading ? (
              <Animated.View style={styles.loadingSpinner}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
              </Animated.View>
            ) : (
              <Ionicons name="send" size={20} color={message?.trim() ? '#FFFFFF' : '#9CA3AF'} />
            )}
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
          <Animated.View style={[styles.modelModal, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.modalHeader}>
              <View>
                <CustomText style={styles.modalTitle}>Select AI Model</CustomText>
                <CustomText style={styles.modalSubtitle}>{models?.length || 0} models available</CustomText>
              </View>
              <TouchableOpacity onPress={closeModelSelector} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modelsScrollView} showsVerticalScrollIndicator={false}>
              {models?.map((model, index) => (
                <TouchableOpacity
                  key={model.id}
                  style={[
                    styles.modelOption,
                    selectedModel?.id === model?.id && styles.selectedModelOption,
                  ]}
                  onPress={() => selectModel(model)}
                  activeOpacity={0.7}>
                  {/* Selection Indicator */}
                  {selectedModel?.id === model?.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                  
                  {/* Model Icon with Badge */}
                  <View style={styles.modelIconWrapper}>
                    <View style={styles.iconGlow}>
                      <Image source={{ uri: model?.icon }} style={styles.modelOptionIcon} />
                    </View>
                    {selectedModel?.id === model?.id && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      </View>
                    )}
                  </View>

                  {/* Model Info */}
                  <View style={styles.modelInfo}>
                    <CustomText style={styles.modelOptionName}>{model.name}</CustomText>
                    <CustomText style={styles.modelDescription} numberOfLines={1}>
                      {model.description || 'Advanced AI language model'}
                    </CustomText>
                    
                    {/* Model Metadata */}
                    <View style={styles.modelMetaContainer}>
                      <View style={styles.contextBadge}>
                        <Ionicons name="documents-outline" size={12} color="#6366F1" />
                        <CustomText style={styles.contextText}>
                          {model.context_length > 100000 
                            ? `${(model.context_length / 1000).toFixed(0)}K tokens` 
                            : `${model.context_length} tokens`}
                        </CustomText>
                      </View>
                      {model.pricing.prompt === '0' && (
                        <View style={styles.freeBadge}>
                          <Ionicons name="star" size={12} color="#F59E0B" />
                          <CustomText style={styles.freeText}>Free</CustomText>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Selection Arrow */}
                  <Ionicons 
                    name={selectedModel?.id === model?.id ? "radio-button-on" : "radio-button-off"} 
                    size={24} 
                    color={selectedModel?.id === model?.id ? '#4C63D2' : '#D1D5DB'} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar?.currentHeight ?? 0) + 20,
    paddingBottom: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    // Ensure proper safe area handling
    minHeight: Platform.OS === 'android' ? 80 : 100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modelIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 10,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginRight: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    // Ensure proper flex behavior on Android
    minHeight: 0,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 20,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiAvatarContainer: {
    marginRight: 8,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  modelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(76, 99, 210, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 99, 210, 0.2)',
  },
  modelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4C63D2',
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
    minHeight: 44,
    justifyContent: 'center',
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
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  userMessageFooter: {
    justifyContent: 'flex-end',
  },
  aiMessageFooter: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  readStatus: {
    marginLeft: 6,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 3,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 12,
    maxHeight: 120,
    minHeight: 44,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4C63D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingSpinner: {
    // You can add rotation animation here if needed
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '90%',
    maxWidth: 420,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  closeButton: {
    marginTop: -4,
  },
  modelsScrollView: {
    maxHeight: 400,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedModelOption: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4C63D2',
    shadowColor: '#4C63D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#4C63D2',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  modelIconWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  iconGlow: {
    padding: 2,
  },
  modelOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modelInfo: {
    flex: 1,
    marginRight: 12,
  },
  modelOptionName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  modelMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  contextText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  freeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    minHeight: '100%',
    // Ensure proper centering on all screen sizes
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Add safe area padding for Android devices
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 280,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 12,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 10,
    flex: 1,
  },
});
