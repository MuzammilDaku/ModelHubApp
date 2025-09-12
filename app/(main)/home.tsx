import React, { useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Pressable,
    Animated,
    StatusBar,
    Platform,
    TextInput
} from "react-native";
import { CustomText } from "components/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "theme/colors";


const chats = [
    {
        id: "1",
        name: "AI Assistant",
        lastMessage: "How can I help you today?",
        date: "2024-06-10",
        time: "2:30 PM",
        avatar: "https://img.icons8.com/color/96/000000/artificial-intelligence.png",
        unread: 2,
        online: true,
    },
    {
        id: "2",
        name: "Lucid React",
        lastMessage: "Let's build something amazing together! 🚀",
        date: "2024-06-09",
        time: "11:45 AM",
        avatar: "https://img.icons8.com/color/96/000000/robot-2.png",
        unread: 0,
        online: false,
    },
    {
        id: "3",
        name: "Creative Studio",
        lastMessage: "New designs are ready for review",
        date: "2024-06-08",
        time: "9:15 AM",
        avatar: "https://img.icons8.com/color/96/000000/design.png",
        unread: 5,
        online: true,
    },
    {
        id: "4",
        name: "Dev Team",
        lastMessage: "Sprint planning meeting tomorrow",
        date: "2024-06-07",
        time: "4:20 PM",
        avatar: "https://img.icons8.com/color/96/000000/conference-call.png",
        unread: 0,
        online: false,
    },
];

export default function ChatListScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [scaleAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-50));

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
            })
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
            })
        ]).start(() => {
            setModalVisible(false);
            setSelectedChatId(null);
        });
    };

    const formatTime = (time: string) => {
        return time;
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.chatItem}>
            <TouchableOpacity
                style={styles.chatContent}
                activeOpacity={0.8}
                onPress={() => {
                    // Handle chat selection
                }}
            >
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    {item.online && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.chatInfo}>
                    <View style={styles.nameRow}>
                        <CustomText style={styles.chatName}>{item.name}</CustomText>
                        <CustomText style={styles.time}>{formatTime(item.time)}</CustomText>
                    </View>
                    <View style={styles.messageRow}>
                        <CustomText style={styles.lastMessage} numberOfLines={1}>
                            {item.lastMessage}
                        </CustomText>
                        {item.unread > 0 && (
                            <View style={styles.unreadBadge}>
                                <CustomText style={styles.unreadText}>
                                    {item.unread > 99 ? '99+' : item.unread}
                                </CustomText>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => openOptions(item.id)}
                style={styles.optionsButton}
                activeOpacity={0.7}
            >
                <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4C63D2" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <CustomText style={styles.headerTitle}>Messages</CustomText>
                    <CustomText style={styles.headerSubtitle}>
                        {chats.filter(chat => chat.unread > 0).length} unread conversations
                    </CustomText>
                </View>
                <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
                    <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchPlaceholder, { flex: 1, padding: 0 }]}
                        placeholder="Search conversations..."
                        placeholderTextColor="#9CA3AF"
                        underlineColorAndroid="transparent"
                    />
                </View>
            </View>

            {/* Chat List */}
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

            {/* FAB */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
                <View style={styles.fabContent}>
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </View>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={closeOptions}
            >
                <Pressable style={styles.modalOverlay} onPress={closeOptions}>
                    <Animated.View
                        style={[
                            styles.popup,
                            {
                                transform: [
                                    { scale: scaleAnim },
                                    { translateY: slideAnim }
                                ]
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                // Handle pin here
                                closeOptions();
                            }}
                            activeOpacity={0.8}
                        >
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
                            activeOpacity={0.8}
                        >
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
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                            <CustomText style={[styles.modalOptionText, styles.deleteText]}>Delete</CustomText>
                        </TouchableOpacity>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : StatusBar?.currentHeight ?? 0 + 20,
        paddingBottom: 20,
        backgroundColor: '#000000',
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#E5E7EB',
        marginTop: 4,
        fontWeight: '400',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchContainer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: '#000000',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '400',
    },
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
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: '#FFFFFF',
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
    unreadBadge: {
        backgroundColor: '#4C63D2',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginLeft: 8,
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
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
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        shadowColor: '#4C63D2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    fabContent: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4C63D2',
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