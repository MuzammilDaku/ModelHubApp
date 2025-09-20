import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { CustomText } from 'components/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10,
    credits: '15K',
    creditsNumber: 15000,
    description: 'Perfect for individuals getting started',
    color: '#4C63D2',
    popular: false,
    features: [
      'Access to all AI models',
      '15,000 monthly tokens',
      'Basic chat history',
      'Email support',
      'Mobile & web access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 30,
    credits: '50K',
    creditsNumber: 50000,
    description: 'Best for power users and professionals',
    color: '#10B981',
    popular: true,
    features: [
      'Access to all AI models',
      '50,000 monthly tokens',
      'Unlimited chat history',
      'Priority support',
      'Advanced analytics',
      'Custom model settings',
      'API access',
      'Team collaboration',
    ],
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubscribe = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    // Handle subscription logic here
    console.log(`Subscribing to ${plan?.name} plan for $${plan?.price}`);
  };

  const renderPlanCard = (plan: typeof plans[0]) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard,
          { borderColor: isSelected ? plan.color : '#E5E7EB' }
        ]}
        activeOpacity={0.8}
        onPress={() => handlePlanSelect(plan.id)}
      >
        {plan.popular && (
          <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
            <CustomText style={styles.popularText}>MOST POPULAR</CustomText>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <View style={styles.planNameSection}>
            <CustomText style={[styles.planName, { color: plan.color }]}>
              {plan.name}
            </CustomText>
            <CustomText style={styles.planDescription}>
              {plan.description}
            </CustomText>
          </View>
          
          {isSelected && (
            <View style={[styles.checkmark, { backgroundColor: plan.color }]}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <CustomText style={styles.currency}>$</CustomText>
            <CustomText style={styles.price}>{plan.price}</CustomText>
            <CustomText style={styles.period}>/month</CustomText>
          </View>
          
          <View style={[styles.creditsContainer, { backgroundColor: plan.color + '10' }]}>
            <CustomText style={[styles.credits, { color: plan.color }]}>
              {plan.credits} tokens
            </CustomText>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: plan.color + '20' }]}>
                <Ionicons name="checkmark" size={14} color={plan.color} />
              </View>
              <CustomText style={styles.featureText}>{feature}</CustomText>
            </View>
          ))}
        </View>

        <View style={styles.valueContainer}>
          <CustomText style={styles.valueLabel}>Cost per 1K tokens:</CustomText>
          <CustomText style={[styles.valuePrice, { color: plan.color }]}>
            ${((plan.price / (plan.creditsNumber / 1000)).toFixed(3))}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <CustomText style={styles.headerTitle}>Choose Your Plan</CustomText>
          <CustomText style={styles.headerSubtitle}>
            Unlock the full potential of AI
          </CustomText>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Plans Grid */}
        <View style={styles.plansContainer}>
          {plans.map(renderPlanCard)}
        </View>

        {/* Features Comparison */}
        <View style={styles.comparisonSection}>
          <CustomText style={styles.comparisonTitle}>Why upgrade?</CustomText>
          
          <View style={styles.comparisonGrid}>
            <View style={styles.comparisonItem}>
              <View style={styles.comparisonIcon}>
                <Ionicons name="flash" size={24} color="#F59E0B" />
              </View>
              <CustomText style={styles.comparisonItemTitle}>More Tokens</CustomText>
              <CustomText style={styles.comparisonItemText}>
                Get more tokens to have longer, more detailed conversations
              </CustomText>
            </View>
            
            <View style={styles.comparisonItem}>
              <View style={styles.comparisonIcon}>
                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              </View>
              <CustomText style={styles.comparisonItemTitle}>Priority Support</CustomText>
              <CustomText style={styles.comparisonItemText}>
                Get faster responses from our support team
              </CustomText>
            </View>
            
            <View style={styles.comparisonItem}>
              <View style={styles.comparisonIcon}>
                <Ionicons name="analytics" size={24} color="#8B5CF6" />
              </View>
              <CustomText style={styles.comparisonItemTitle}>Advanced Features</CustomText>
              <CustomText style={styles.comparisonItemText}>
                Access to analytics, API, and team collaboration
              </CustomText>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <CustomText style={styles.faqTitle}>Frequently Asked Questions</CustomText>
          
          <View style={styles.faqItem}>
            <CustomText style={styles.faqQuestion}>What are tokens?</CustomText>
            <CustomText style={styles.faqAnswer}>
              Tokens are units used to measure AI usage. Roughly 1 token = 1 word.
            </CustomText>
          </View>
          
          <View style={styles.faqItem}>
            <CustomText style={styles.faqQuestion}>Can I change plans anytime?</CustomText>
            <CustomText style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time from your account settings.
            </CustomText>
          </View>
          
          <View style={styles.faqItem}>
            <CustomText style={styles.faqQuestion}>What happens if I exceed my limit?</CustomText>
            <CustomText style={styles.faqAnswer}>
              You'll be notified when approaching your limit. You can upgrade or wait for next month's reset.
            </CustomText>
          </View>
        </View>
      </ScrollView>

      {/* Subscribe Button */}
      <View style={styles.subscribeContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              { backgroundColor: plans.find(p => p.id === selectedPlan)?.color || '#4C63D2' }
            ]}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <CustomText style={styles.subscribeButtonText}>
              Subscribe to {plans.find(p => p.id === selectedPlan)?.name} - $
              {plans.find(p => p.id === selectedPlan)?.price}/month
            </CustomText>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
        
        <CustomText style={styles.subscribeNote}>
          Cancel anytime. No hidden fees. 7-day free trial.
        </CustomText>
      </View>
    </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar?.currentHeight ?? 0 + 20),
    paddingBottom: 16,
    backgroundColor: '#000000',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '400',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedPlanCard: {
    shadowColor: '#4C63D2',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 24,
    right: 24,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  planNameSection: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 20,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceSection: {
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  price: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 48,
  },
  period: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  creditsContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  credits: {
    fontSize: 14,
    fontWeight: '700',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '400',
    flex: 1,
    lineHeight: 20,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  valueLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  valuePrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  comparisonSection: {
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  comparisonGrid: {
    gap: 16,
  },
  comparisonItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  comparisonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonItemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  comparisonItemText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: 32,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 20,
  },
  subscribeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  subscribeNote: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
    textAlign: 'center',
  },
});