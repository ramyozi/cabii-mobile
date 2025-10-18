import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AccessibleCard from '@/components/ui/accessible-card';
import AccessibleButton from '@/components/ui/accessible-button';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceAssistant, setVoiceAssistant] = useState(false);

  const handleToggle = (setter: (v: boolean) => void) => (value: boolean) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Politique de confidentialité', 'Lien vers la politique de confidentialité');
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
          <Text style={styles.subtitle}>Gérez vos préférences et sécurité</Text>
        </View>

        <AccessibleCard title="Préférences">
          <SettingRow
            icon="notifications"
            color="#007AFF"
            title="Notifications"
            description="Alertes et rappels de trajets"
            value={notifications}
            onChange={handleToggle(setNotifications)}
          />
          <SettingRow
            icon="location"
            color="#34C759"
            title="Localisation"
            description="Autoriser le suivi GPS"
            value={location}
            onChange={handleToggle(setLocation)}
          />
          <SettingRow
            icon="moon"
            color="#8E8E93"
            title="Mode sombre"
            description="Thème visuel foncé"
            value={darkMode}
            onChange={handleToggle(setDarkMode)}
          />
          <SettingRow
            icon="mic"
            color="#FF9500"
            title="Assistant vocal"
            description="Commandes vocales activées"
            value={voiceAssistant}
            onChange={handleToggle(setVoiceAssistant)}
          />
        </AccessibleCard>

        <AccessibleCard title="Sécurité et confidentialité">
          <AccessibleButton
            title="Changer le mot de passe"
            variant="secondary"
            onPress={() => Alert.alert('À venir')}
          />
          <AccessibleButton
            title="Politique de confidentialité"
            variant="secondary"
            onPress={handlePrivacyPolicy}
          />
          <AccessibleButton title="Déconnexion" variant="danger" onPress={handleLogout} />
        </AccessibleCard>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingRowProps = {
  icon: string;
  color: string;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function SettingRow({ icon, color, title, description, value, onChange }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon as any} size={20} color={color} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#E5E5EA', true: color }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollView: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '700', color: '#1C1C1E' },
  subtitle: { fontSize: 16, color: '#8E8E93' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', color: '#1C1C1E' },
  settingDescription: { fontSize: 12, color: '#8E8E93' },
});
