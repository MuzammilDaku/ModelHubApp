import { useState } from 'react';
import {
  Modal,
  Pressable,
  Animated,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from 'components/Text';
import { Model, useChatStore } from 'store/chats/store';
import { api } from 'server/api';
import { useProfileStore } from 'store/profile/store';

export default function NewChatModal({
  newChatModalVisible,
  closeNewChatModal,
  newChatScaleAnim,
  models,
}: {
  newChatModalVisible: boolean;
  closeNewChatModal: () => void;
  newChatScaleAnim: Animated.Value;
  models: Model[] | null;
}) {
  const [newChatName, setNewChatName] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model>((models ?? [])[0]);

  const user = useProfileStore((state) => state.user);
  const addChat = useChatStore((state) => state.addChat);

  // console.log(user)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createNewChat = async () => {
    // console.log(user)
    if (!user) return;
    try {
      setIsLoading(true);
      const chat = await api.createChat({
        name: newChatName,
        lastUsedModel: selectedModel.id,
        createdBy: user.id,
      });
      addChat(chat);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      closeNewChatModal();
    }
  };

  return (
    <Modal
      visible={newChatModalVisible}
      transparent
      animationType="none"
      onRequestClose={closeNewChatModal}>
      <Pressable style={styles.modalOverlay} onPress={closeNewChatModal}>
        <Animated.View style={[styles.newChatModal, { transform: [{ scale: newChatScaleAnim }] }]}>
          {/* Header */}
          <View style={styles.newChatHeader}>
            <CustomText style={styles.newChatTitle}>New Chat</CustomText>
            <TouchableOpacity onPress={closeNewChatModal}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Chat Name Input */}
          <View style={styles.inputSection}>
            <CustomText style={styles.inputLabel}>Chat Name</CustomText>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter chat name..."
              placeholderTextColor="#9CA3AF"
              value={newChatName}
              onChangeText={setNewChatName}
              maxLength={50}
            />
          </View>

          {/* Model Selection */}
          <View style={styles.inputSection}>
            <CustomText style={styles.inputLabel}>Select AI Model</CustomText>
            <ScrollView style={styles.modelsList} showsVerticalScrollIndicator={false}>
              {models?.map((model) => (
                <TouchableOpacity
                  key={model?.id}
                  style={[
                    styles.modelOption,
                    selectedModel?.id === model?.id && styles.selectedModelOption,
                  ]}
                  onPress={() => setSelectedModel(model)}
                  activeOpacity={0.8}>
                  <Image source={{ uri: model.icon }} style={styles.modelOptionIcon} />
                  <View style={styles.modelInfo}>
                    <CustomText style={styles.modelOptionName}>{model.name}</CustomText>
                  </View>
                  {selectedModel?.id === model?.id && (
                    <View style={styles.radioButton}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeNewChatModal}
              activeOpacity={0.8}>
              <CustomText style={styles.cancelButtonText}>Cancel</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, !newChatName.trim() && styles.createButtonDisabled]}
              onPress={createNewChat}
              activeOpacity={0.8}
              disabled={!newChatName.trim() || !selectedModel || isLoading}>
              <CustomText
                style={[
                  styles.createButtonText,
                  !newChatName.trim() && styles.createButtonTextDisabled,
                ]}>
                {isLoading ? <ActivityIndicator color={'#fefefe'} /> : 'Create Chat'}
              </CustomText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  newChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  newChatTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  modelsList: {
    maxHeight: 200,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedModelOption: {
    backgroundColor: '#F0F9FF',
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
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4C63D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#4C63D2',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  createButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
