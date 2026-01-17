import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/create.styles";
import { COLORS } from "@/constants/colors";
import { API_URL } from "@/constants/api";

const CATEGORIES = [
  { name: "Food & Drinks", icon: "fast-food" },
  { name: "Shopping", icon: "cart" },
  { name: "Transportation", icon: "car" },
  { name: "Entertainment", icon: "film" },
  { name: "Bills", icon: "receipt" },
  { name: "Income", icon: "cash" },
  { name: "Other", icon: "ellipsis-horizontal" },
];

export default function CreateTransaction() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [type, setType] = useState("expense"); // "income" or "expense"
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          title: title.trim(),
          amount: Math.abs(parseFloat(amount)),
          category: type === "income" ? "Income" : category,
          type: type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      Alert.alert("Success", "Transaction added successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating transaction:", error);
      Alert.alert("Error", "Failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              <Text style={styles.saveButton}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Transaction Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "expense" && styles.typeButtonActive,
              ]}
              onPress={() => setType("expense")}
            >
              <Ionicons
                name="arrow-down-circle"
                size={20}
                color={type === "expense" ? COLORS.white : COLORS.expense}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === "expense" && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "income" && styles.typeButtonActive,
              ]}
              onPress={() => setType("income")}
            >
              <Ionicons
                name="arrow-up-circle"
                size={20}
                color={type === "income" ? COLORS.white : COLORS.income}
                style={styles.typeIcon}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === "income" && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={COLORS.textLight}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Grocery shopping"
              placeholderTextColor={COLORS.textLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Category Selector (only for expenses) */}
          {type === "expense" && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.filter((c) => c.name !== "Income").map((cat) => (
                  <TouchableOpacity
                    key={cat.name}
                    style={[
                      styles.categoryButton,
                      category === cat.name && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={20}
                      color={category === cat.name ? COLORS.white : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat.name && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
