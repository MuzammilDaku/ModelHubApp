import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chat } from 'store/chats/store';
import { CustomText } from 'components/Text';
import { colors } from 'theme/colors';

const formatTime = (time: string) => {
  return time;
};

export default function ChatList({
  chats,
  openOptions,
}: {
  chats: chat[] | null;
  openOptions: (id: string) => void;
}) {
  const router = useRouter();

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.chatItem} key={index}>
      <TouchableOpacity
        style={styles.chatContent}
        activeOpacity={0.8}
        onPress={() => {
          router.push(`/chat`);
        }}>
        <View style={styles.avatarContainer}>
          <Ionicons name="chatbubbles-outline" size={26} />
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <CustomText style={styles.chatName}>{item?.name}</CustomText>
            <CustomText style={styles.time}>
              {formatTime(item?.lastMessageTime)}
            </CustomText>
          </View>
          <View style={styles.messageRow}>
            <CustomText style={styles.lastMessage} numberOfLines={1}>
              {item?.lastMessage}
            </CustomText>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openOptions(item.id)}
        style={styles.optionsButton}
        activeOpacity={0.7}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.chatListContainer}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chatListContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    marginTop: -8,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chatContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  time: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 20,
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',   
    backgroundColor: '#F8FAFC',
    marginLeft: 8,
  },
  separator: {
    height: 12,
  },
});
