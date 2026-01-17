import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { useTransactions } from "@/hooks/useTransactions";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import NoTransactionsFound from "@/components/NoTransactionsFound";
import PageLoader from "@/components/PageLoader";

export default function HomePage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id;
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(userId);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "User"}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <BalanceCard summary={summary} />

        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}