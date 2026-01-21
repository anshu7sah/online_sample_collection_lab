import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, Download, Calendar, Clock } from "lucide-react-native";
import * as Linking from "expo-linking";
import { useMyBookings } from "@/hooks/useMyBookings";

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<"completed" | "upcoming">("completed");

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useMyBookings({
    page: 1,
    limit: 50,
  });

  const bookings = data?.data ?? [];

  const completed = bookings.filter(
    (b: any) => b.status === "COMPLETED"
  );

  const upcoming = bookings.filter(
    (b: any) => b.status === "SCHEDULED" || b.status === "SAMPLE_COLLECTED"
  );

  const renderEmpty = (text: string) => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming Tests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#008080"
          style={{ marginTop: 40 }}
        />
      )}

      {/* Content */}
      {!isLoading && (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={["#008080"]}
              tintColor="#008080"
            />
          }
        >
          {/* Completed Reports */}
          {activeTab === "completed" &&
            (completed.length === 0
              ? renderEmpty("No reports available yet")
              : completed.map((booking: any) => (
                  <View key={booking.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconCircle}>
                        <FileText size={22} color="#008080" />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.title}>
                          {booking.items.map((i: any) => i.name).join(", ")}
                        </Text>

                        <View style={styles.meta}>
                          <Calendar size={14} color="#6B7280" />
                          <Text style={styles.metaText}>
                            {new Date(booking.date).toDateString()}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Ready</Text>
                      </View>
                    </View>

                    {booking.reportUrl && (
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() =>
                          Linking.openURL(booking.reportUrl)
                        }
                      >
                        <Download size={16} color="#008080" />
                        <Text style={styles.downloadText}>
                          Download Report
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )))}

          {/* Upcoming Tests */}
          {activeTab === "upcoming" &&
            (upcoming.length === 0
              ? renderEmpty("No upcoming tests")
              : upcoming.map((booking: any) => (
                  <View key={booking.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconCircle, styles.upcomingIcon]}>
                        <Clock size={22} color="#B45309" />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.title}>
                          {booking.items.map((i: any) => i.name).join(", ")}
                        </Text>

                        <View style={styles.meta}>
                          <Calendar size={14} color="#6B7280" />
                          <Text style={styles.metaText}>
                            {new Date(booking.date).toDateString()} • {booking.timeSlot}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.upcomingBadge}>
                        <Text style={styles.upcomingText}>
                          {booking.status === "SAMPLE_COLLECTED"
                            ? "Sample Collected"
                            : "Scheduled"}
                        </Text>
                      </View>
                    </View>
                  </View>
                )))}
        </ScrollView>
      )}

      {isFetching && !isLoading && (
        <Text style={styles.fetchingText}>Refreshing…</Text>
      )}
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E6F2F2",
    margin: 16,
    padding: 4,
    borderRadius: 14,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#008080",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E6F2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  upcomingIcon: {
    backgroundColor: "#FEF3C7",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },

  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#15803D",
  },

  upcomingBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  upcomingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B45309",
  },

  downloadBtn: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F2F2",
    paddingVertical: 10,
    borderRadius: 10,
  },

  downloadText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#008080",
  },

  emptyBox: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },

  fetchingText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    paddingBottom: 8,
  },
});
