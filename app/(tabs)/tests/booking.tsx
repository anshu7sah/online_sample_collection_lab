import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Building, CreditCard, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function BookingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  const steps = [
    { id: 1, title: 'Location', icon: MapPin },
    { id: 2, title: 'Date & Time', icon: Calendar },
    { id: 3, title: 'Lab Location', icon: Building },
    { id: 4, title: 'Payment', icon: CreditCard },
    { id: 5, title: 'Confirmation', icon: CheckCircle },
  ];

  const locations = [
    'Kathmandu, Thamel',
    'Kathmandu, Baneshwor',
    'Lalitpur, Patan',
    'Bhaktapur, Durbar Square',
  ];

  const labs = [
    { name: 'Sukra Polyclinic - Main Branch', city: 'Kathmandu', contact: '+977-1-4567890' },
    { name: 'Sukra Polyclinic - Patan', city: 'Lalitpur', contact: '+977-1-4567891' },
    { name: 'Sukra Polyclinic - Bhaktapur', city: 'Bhaktapur', contact: '+977-1-4567892' },
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', subtitle: 'Pay when sample is collected' },
    { id: 'esewa', name: 'eSewa', subtitle: 'Digital wallet payment' },
    { id: 'khalti', name: 'Khalti', subtitle: 'Digital wallet payment' },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Booking Confirmed!', 'Your test has been booked successfully.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Your Location</Text>
            <Text style={styles.stepSubtitle}>Choose your home location for sample collection</Text>
            {locations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionCard, selectedLocation === location && styles.selectedOption]}
                onPress={() => setSelectedLocation(location)}
              >
                <Text style={styles.optionText}>{location}</Text>
                {selectedLocation === location && <CheckCircle size={20} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Date & Time</Text>
            <Text style={styles.stepSubtitle}>Choose convenient date and time for sample collection</Text>
            <TouchableOpacity
              style={[styles.optionCard, selectedDate && styles.selectedOption]}
              onPress={() => setSelectedDate('2024-01-25 at 10:00 AM')}
            >
              <Text style={styles.optionText}>Tomorrow, January 25, 2024 - 10:00 AM</Text>
              {selectedDate && <CheckCircle size={20} color="#2563EB" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard]}
              onPress={() => setSelectedDate('2024-01-26 at 9:00 AM')}
            >
              <Text style={styles.optionText}>January 26, 2024 - 9:00 AM</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Lab Location</Text>
            <Text style={styles.stepSubtitle}>Choose lab for processing your samples</Text>
            {labs.map((lab, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionCard, selectedLab === lab.name && styles.selectedOption]}
                onPress={() => setSelectedLab(lab.name)}
              >
                <View style={styles.labInfo}>
                  <Text style={styles.labName}>{lab.name}</Text>
                  <Text style={styles.labCity}>{lab.city}</Text>
                  <Text style={styles.labContact}>{lab.contact}</Text>
                </View>
                {selectedLab === lab.name && <CheckCircle size={20} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Payment Method</Text>
            <Text style={styles.stepSubtitle}>Choose your preferred payment method</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.optionCard, selectedPayment === method.id && styles.selectedOption]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
                </View>
                {selectedPayment === method.id && <CheckCircle size={20} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContent}>
            <View style={styles.confirmationIcon}>
              <CheckCircle size={64} color="#16A34A" />
            </View>
            <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
            <Text style={styles.confirmationText}>
              Your test has been successfully booked. You will receive a confirmation SMS shortly.
            </Text>
            <View style={styles.bookingSummary}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <Text style={styles.summaryItem}>Location: {selectedLocation}</Text>
              <Text style={styles.summaryItem}>Date & Time: {selectedDate}</Text>
              <Text style={styles.summaryItem}>Lab: {selectedLab}</Text>
              <Text style={styles.summaryItem}>Payment: {paymentMethods.find(p => p.id === selectedPayment)?.name}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step) => (
          <View key={step.id} style={styles.stepIndicator}>
            <View style={[styles.stepCircle, currentStep >= step.id && styles.activeStep]}>
              <step.icon size={16} color={currentStep >= step.id ? '#FFFFFF' : '#9CA3AF'} />
            </View>
            <Text style={[styles.stepLabel, currentStep >= step.id && styles.activeStepLabel]}>
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {currentStep < 5 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Confirm Booking' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#2563EB',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#2563EB',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  labInfo: {
    flex: 1,
  },
  labName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  labCity: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  labContact: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  confirmationIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  bookingSummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});