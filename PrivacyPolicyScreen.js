import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Privacy Policy</Text>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        This is a placeholder Privacy Policy. Your data is stored securely and only used for app functionality. For more details, contact support.
      </Text>
    </ScrollView>
  );
} 