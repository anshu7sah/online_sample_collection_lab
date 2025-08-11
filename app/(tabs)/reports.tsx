import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Download, Calendar, Clock } from 'lucide-react-native';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('completed');

  const completedReports = [
    {
      id: 1,
      testName: 'Full Body Checkup',
      date: '2024-01-15',
      status: 'Ready',
      reportUrl: '#',
    },
    {
      id: 2,
      testName: 'Diabetes Panel',
      date: '2024-01-10',
      status: 'Ready',
      reportUrl: '#',
    },
    {
      id: 3,
      testName: 'Liver Function Test',
      date: '2024-01-05',
      status: 'Ready',
      reportUrl: '#',
    },
  ];

  const upcomingTests = [
    {
      id: 4,
      testName: 'Heart Health Package',
      date: '2024-01-25',
      time: '10:00 AM',
      status: 'Scheduled',
    },
    {
      id: 5,
      testName: 'Blood Sugar Test',
      date: '2024-01-28',
      time: '9:30 AM',
      status: 'Scheduled',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed Tests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming Tests
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'completed' ? (
          completedReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportIcon}>
                  <FileText size={24} color="#2563EB" />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportName}>{report.testName}</Text>
                  <View style={styles.reportMeta}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.reportDate}>{report.date}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={16} color="#2563EB" />
                <Text style={styles.downloadText}>Download Report</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          upcomingTests.map((test) => (
            <View key={test.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportIcon}>
                  <Clock size={24} color="#F59E0B" />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportName}>{test.testName}</Text>
                  <View style={styles.reportMeta}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.reportDate}>{test.date} at {test.time}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, styles.upcomingBadge]}>
                  <Text style={[styles.statusText, styles.upcomingText]}>{test.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  upcomingText: {
    color: '#D97706',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },
});