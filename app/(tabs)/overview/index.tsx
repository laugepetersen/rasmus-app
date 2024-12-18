import { getTickets } from "@/db"; // Import the function to fetch tickets
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  const [totalTickets, setTotalTickets] = useState(0);
  const [solvedTickets, setSolvedTickets] = useState(0);
  const [unsolvedTickets, setUnsolvedTickets] = useState(0);

  const fetchTickets = async () => {
    const tickets = await getTickets();
    setTotalTickets(tickets.length);
    setSolvedTickets(tickets.filter((ticket) => ticket.solved).length);
    setUnsolvedTickets(tickets.filter((ticket) => !ticket.solved).length);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Overview",
        }}
      />
      <View style={styles.container}>
        <View style={styles.grid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{unsolvedTickets}</Text>
            <Text style={styles.statLabel}>Unsolved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{solvedTickets}</Text>
            <Text style={styles.statLabel}>Solved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalTickets}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    flex: 1,
    minWidth: 100, // Ensures a minimum width for each box
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#285D43",
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
});
