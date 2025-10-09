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
            <View style={styles.labelRow}>
              <CustomText style={styles.inputLabel}>Select AI Model</CustomText>
              <View style={styles.modelCountBadge}>
                <CustomText style={styles.modelCountText}>{models?.length || 0} available</CustomText>
              </View>
            </View>
            <ScrollView style={styles.modelsList} showsVerticalScrollIndicator={false}>
              {models?.map((model, index) => (
                <TouchableOpacity
                  key={model?.id}
                  style={[
                    styles.modelOption,
                    selectedModel?.id === model?.id && styles.selectedModelOption,
                  ]}
                  onPress={() => setSelectedModel(model)}
                  activeOpacity={0.7}>
                  {/* Selection Indicator */}
                  {selectedModel?.id === model?.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                  
                  {/* Model Icon */}
                  <View style={styles.modelIconContainer}>
                    <Image source={{ uri: model.icon }} style={styles.modelOptionIcon} />
                    {selectedModel?.id === model?.id && (
                      <View style={styles.checkmarkBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      </View>
                    )}
                  </View>

                  {/* Model Info */}
                  <View style={styles.modelInfo}>
                    <CustomText style={styles.modelOptionName}>{model.name}</CustomText>
                    <CustomText style={styles.modelDescription} numberOfLines={1}>
                      {model.description || 'Advanced AI model for your tasks'}
                    </CustomText>
                    <View style={styles.modelMetaRow}>
                      <View style={styles.metaBadge}>
                        <Ionicons name="layers-outline" size={12} color="#6366F1" />
                        <CustomText style={styles.metaText}>
                          {model.context_length > 100000 ? `${(model.context_length / 1000).toFixed(0)}K` : model.context_length}
                        </CustomText>
                      </View>
                      {model.pricing.prompt === '0' && (
                        <View style={[styles.metaBadge, styles.freeBadge]}>
                          <Ionicons name="star" size={12} color="#F59E0B" />
                          <CustomText style={[styles.metaText, styles.freeText]}>Free</CustomText>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Arrow indicator */}
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={selectedModel?.id === model?.id ? '#4C63D2' : '#D1D5DB'} 
                  />
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modelCountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modelCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 10,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#4C63D2',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  modelIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  modelOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  checkmarkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  modelInfo: {
    flex: 1,
    marginRight: 8,
  },
  modelOptionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  modelMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  freeBadge: {
    backgroundColor: '#FEF3C7',
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  freeText: {
    color: '#F59E0B',
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
