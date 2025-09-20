import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CustomText } from 'components/Text';
import { Ionicons } from '@expo/vector-icons';

const EmptyChatsState = ({ onCreateChat }:{onCreateChat:any}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Icon Container */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}>
          <View style={styles.iconBackground}>
            <Ionicons name="chatbubbles-outline" size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* Main Text */}
        <CustomText style={styles.title}>No conversations yet</CustomText>
        <CustomText style={styles.subtitle}>
          Start your first conversation with AI
        </CustomText>

        {/* Call to Action */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onCreateChat}
          activeOpacity={0.8}>
          <Ionicons name="add" size={20} color="#4C63D2" style={styles.ctaIcon} />
          <CustomText style={styles.ctaText}>Create New Chat</CustomText>
        </TouchableOpacity>

        {/* Arrow pointing to FAB */}
        <View style={styles.arrowContainer}>
          <View style={styles.arrowLine} />
          <View style={styles.arrowHead} />
          <CustomText style={styles.arrowText}>
            Or tap the + button
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 120, // Account for FAB
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 48,
  },
  ctaIcon: {
    marginRight: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4C63D2',
  },
  arrowContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  arrowLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: -2,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
  },
  arrowText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});

export default EmptyChatsState;