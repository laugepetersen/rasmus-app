import { getTicketById, updateTicket } from "@/db"; // Import necessary functions
import { timeAgo } from "@/utils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TicketDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [ticket, setTicket] = useState<any>(null);

  const fetchTicket = async () => {
    const fetchedTicket = await getTicketById(id); // Use the ID to fetch the ticket
    setTicket(fetchedTicket);
  };

  const markAsSolved = async () => {
    await updateTicket(id, { solved: true });
    alert("Ticket marked as solved");
    router.back(); // Navigate back after marking as solved
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (!ticket) {
    return <Text>Loading...</Text>; // Loading state
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Ticket Details",
          headerBackTitle: "Back",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.description}>{ticket.description}</Text>
        <Text style={styles.location}>Location: {ticket.location}</Text>
        <Text style={styles.location}>
          {timeAgo(ticket.createdAt.toDate())}
        </Text>
        <TouchableOpacity style={styles.button} onPress={markAsSolved}>
          <Text style={styles.buttonText}>Mark as Solved</Text>
        </TouchableOpacity>
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
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  createdAt: {
    fontSize: 12,
    color: "#aaa",
  },
  button: {
    backgroundColor: "#285D43",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
