import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart, Check } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import { useApp } from "@/contexts/AppContext";
import { useSinglePackage } from "@/hooks/useSinglePackage";

export default function PackageDetailsScreen() {
  const { id } = useLocalSearchParams();
  const packageId = Number(id);

  const { dispatch } = useApp();
  const { data: pkg, isLoading, isError } = useSinglePackage({ id: packageId });

  const addToCart = () => {
    if (!pkg) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        type: "package",
      },
    });

    Alert.alert("Added to Cart", `${pkg.name} has been added to your cart.`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading package details...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !pkg) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Package not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* -------- Header -------- */}
        <View style={styles.header}>
          <Text style={styles.packageName}>{pkg.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>NPR {pkg.price}</Text>
          </View>
        </View>

        {/* -------- Description -------- */}
        {pkg.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{pkg.description}</Text>
          </View>
        )}

        {/* -------- Included Tests -------- */}
        {pkg.tests?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Included Tests ({pkg.tests.length})</Text>
            {pkg.tests.map((item) => (
              <View key={item.id} style={styles.parameterItem}>
                <Check size={16} color="#16A34A" />
                <Text style={styles.parameterText}>{item.testName}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* -------- Footer: Add to Cart -------- */}
      <View style={styles.footer}>
        <View style={styles.footerPricing}>
          <Text style={styles.footerPriceLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>NPR {pkg.price}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add Package to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FDFD" },
  content: { flex: 1 },

  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },
  packageName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  priceContainer: {},
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#16A34A", // green
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  parameterItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  parameterText: { fontSize: 14, color: "#1F2937", marginLeft: 8 },

  footer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerPricing: { flex: 1 },
  footerPriceLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  footerPrice: { fontSize: 18, fontWeight: "700", color: "#16A34A" }, // green
  addToCartButton: {
    backgroundColor: "#16A34A", // green
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#6B7280" },
  errorText: { fontSize: 16, color: "red" },
});
