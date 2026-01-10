import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AccessibleCard from '@/components/ui/accessible-card';
import AccessibleButton from '@/components/ui/accessible-button';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import {
  AccessibilityFeature,
  ActiveRoleEnum,
  DriverCommission,
  DriverProfile,
  Reservation,
  RoleEnum,
  User,
  Vehicle,
  VehicleStatusEnum,
} from '@ramyozi/cabii-shared';

export default function ProfileScreen() {
  const { user, loading, refreshTokens } = useAuth();

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color="#007AFF" />
        <Muted style={{ marginTop: 8 }}>Chargement du profil…</Muted>
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <Title>Profil introuvable</Title>
        <Muted>Impossible de charger les informations de l`&apos;`utilisateur.</Muted>
        <Spacer y={12} />
        <AccessibleButton title="Réessayer" onPress={refreshTokens} />
      </Centered>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <HeaderBlock user={user} />

        <ContactSection user={user} />

        {/* Accessibility */}
        <AccessibilitySection user={user} />

        {/* Driver specifics */}
        <DriverSection user={user} />

        {/* Customer specifics */}
        <CustomerSection user={user} />

        {/* Account meta */}
        <AccountMeta user={user} />

        <Spacer y={24} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================================================
 * Types & Utilities
 * =======================================================================================*/

type NonEmptyArray<T> = readonly [T, ...T[]];

type Nullable<T> = T | null | undefined;

type Maybe<T> = T | undefined;

type GuardResult<T> = T extends false | 0 | '' | null | undefined ? never : T;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonEmptyArray<T>(arr: readonly T[] | undefined | null): arr is NonEmptyArray<T> {
  return Array.isArray(arr) && arr.length > 0;
}

function safeArray<T>(arr: readonly T[] | undefined | null): T[] {
  return Array.isArray(arr) ? [...arr] : [];
}

function asTitleCase(input: string): string {
  if (!isNonEmptyString(input)) return '';
  return input
    .toLowerCase()
    .split(/[\s_-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatPhoneFrench(phone: string | undefined): string {
  if (!isNonEmptyString(phone)) return '—';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return phone;
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

function formatDateShort(iso: string | undefined): string {
  if (!isNonEmptyString(iso)) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTimeShort(iso: string | undefined): string {
  if (!isNonEmptyString(iso)) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ago(iso: string | undefined): string {
  if (!isNonEmptyString(iso)) return '—';
  const d = new Date(iso).getTime();
  const now = Date.now();
  if (!Number.isFinite(d)) return '—';
  const diff = Math.max(0, now - d);
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 0) return `${day}j`;
  if (hr > 0) return `${hr}h`;
  if (min > 0) return `${min}m`;
  return `${sec}s`;
}

function pluralize(n: number, unit: string, unitPlural?: string): string {
  const p = Math.abs(n) > 1 ? (unitPlural ?? `${unit}s`) : unit;
  return `${n} ${p}`;
}

function toHexOrName(color: string | undefined): string {
  if (!isNonEmptyString(color)) return '#A1A1AA';
  const c = color.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c;
  const known: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#FF3B30',
    blue: '#007AFF',
    green: '#34C759',
    gray: '#8E8E93',
    silver: '#C0C0C0',
    grey: '#8E8E93',
  };
  return known[c.toLowerCase()] ?? '#A1A1AA';
}

function safeVehicleTitle(vehicle: Vehicle | undefined): string {
  if (!vehicle) return 'Véhicule indisponible';
  const brand = isNonEmptyString(vehicle.brand) ? vehicle.brand : '—';
  const model = isNonEmptyString(vehicle.model) ? vehicle.model : '';
  const year = isFiniteNumber(vehicle.year) ? ` · ${vehicle.year}` : '';
  return `${brand}${model ? ` ${model}` : ''}${year}`;
}

function vehicleStatusLabel(status: VehicleStatusEnum | string | undefined): string {
  switch (status) {
    case 'ACTIVE':
      return 'Actif';
    case 'INACTIVE':
      return 'Inactif';
    case 'UNDER_REVIEW':
      return 'En révision';
    default:
      return '—';
  }
}

function isDriverActive(user: User): boolean {
  return user.activeRole === ActiveRoleEnum.Driver;
}

function isCustomerActive(user: User): boolean {
  return user.activeRole === ActiveRoleEnum.Customer;
}

function openTel(phone: string | undefined) {
  if (!isNonEmptyString(phone)) return;
  Linking.openURL(`tel:${phone}`);
}

function openMail(email: string | undefined) {
  if (!isNonEmptyString(email)) return;
  Linking.openURL(`mailto:${email}`);
}

/* =========================================================================================
 * Small UI Primitives (no external deps beyond your UI kit)
 * =======================================================================================*/

function Spacer({ y = 8, x = 0 }: { y?: number; x?: number }) {
  return <View style={{ height: y, width: x }} />;
}

function Row({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

function Col({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[{ flexDirection: 'column' }, style]}>{children}</View>;
}

function Muted({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ color: '#8E8E93', fontSize: 14 }, style]}>{children}</Text>;
}

function Title({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <Text style={[{ fontSize: 20, fontWeight: '600', color: '#1C1C1E' }, style]}>{children}</Text>
  );
}

function SubTitle({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <Text style={[{ fontSize: 16, fontWeight: '500', color: '#1C1C1E' }, style]}>{children}</Text>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#E5E5EA', marginVertical: 12 }} />;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: '#EFEFF4',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        marginRight: 8,
        marginBottom: 8,
      }}>
      <Text style={{ fontSize: 12, color: '#1C1C1E' }}>{children}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof IoniconName;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Row style={{ justifyContent: 'space-between', paddingVertical: 6 }}>
      <Row>
        <Ionicons name={icon as any} size={18} color="#007AFF" style={{ marginRight: 8 }} />
        <Muted>{label}</Muted>
      </Row>
      <Text
        onPress={onPress}
        style={{
          color: onPress ? '#007AFF' : '#1C1C1E',
          fontSize: 15,
          maxWidth: '60%',
          textAlign: 'right',
        }}>
        {value}
      </Text>
    </Row>
  );
}

const IoniconName = {
  call: 'call',
  mail: 'mail',
  car: 'car',
  colorPalette: 'color-palette',
  shieldCheckmark: 'shield-checkmark',
  documentText: 'document-text',
  star: 'star',
  location: 'location',
  timer: 'timer',
  calendar: 'calendar',
  swapVertical: 'swap-vertical',
  pricetag: 'pricetag',
  navigate: 'navigate',
  speedometer: 'speedometer',
  checkmarkCircle: 'checkmark-circle',
  time: 'time',
  informationCircle: 'information-circle',
  wallet: 'wallet',
  pricetags: 'pricetags',
  briefcase: 'briefcase',
  people: 'people',
  clipboard: 'clipboard',
  map: 'map',
  ellipse: 'ellipse',
} as const;

/* =========================================================================================
 * Header
 * =======================================================================================*/

function HeaderBlock({ user }: { user: User }) {
  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(' ').trim() || 'Utilisateur';
  const roleChip = isDriverActive(user)
    ? 'Conducteur'
    : isCustomerActive(user)
      ? 'Client'
      : user.activeRole === ActiveRoleEnum.Admin
        ? 'Admin'
        : 'En onboarding';

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{fullName}</Text>
      <Muted>Rôle actif : {roleChip}</Muted>
    </View>
  );
}

/* =========================================================================================
 * Contact Section
 * =======================================================================================*/

function ContactSection({ user }: { user: User }) {
  const email = isNonEmptyString(user.email) ? user.email : '—';
  const phone = isNonEmptyString(user.phone) ? formatPhoneFrench(user.phone) : '—';

  return (
    <AccessibleCard title="Coordonnées" accessibilityLabel="Coordonnées">
      <InfoRow icon="mail" label="Email" value={email} onPress={() => openMail(user.email)} />
      <InfoRow icon="call" label="Téléphone" value={phone} onPress={() => openTel(user.phone)} />
    </AccessibleCard>
  );
}

/* =========================================================================================
 * Accessibility Section (User & Vehicle)
 * =======================================================================================*/

function AccessibilitySection({ user }: { user: User }) {
  const userFeatures = safeArray(user.accessibilityPreferences)
    .map(ua => ua?.feature)
    .filter(Boolean) as AccessibilityFeature[];

  const driverFeatures: AccessibilityFeature[] = (() => {
    if (!isDriverActive(user) || !user.driverProfile) return [];
    const vAll = safeArray(user.driverProfile.vehicles);
    const feats = new Map<string, AccessibilityFeature>();
    vAll.forEach(v =>
      safeArray(v.accessibilityOptions).forEach(va => {
        if (va?.feature?.id && !feats.has(va.feature.id)) feats.set(va.feature.id, va.feature);
      }),
    );
    return Array.from(feats.values());
  })();

  if (!isNonEmptyArray(userFeatures) && !isNonEmptyArray(driverFeatures)) {
    return (
      <AccessibleCard title="Accessibilité">
        <Muted>Aucune préférence d’accessibilité n’a été configurée pour l’instant.</Muted>
      </AccessibleCard>
    );
  }

  return (
    <AccessibleCard title="Accessibilité">
      {isNonEmptyArray(userFeatures) && (
        <>
          <SubTitle>Préférences de l’utilisateur</SubTitle>
          <Spacer y={8} />
          <Row style={{ flexWrap: 'wrap' }}>
            {userFeatures.map(f => (
              <Tag key={f.id}>{asTitleCase(f.name)}</Tag>
            ))}
          </Row>
          <Spacer y={12} />
        </>
      )}

      {isNonEmptyArray(driverFeatures) && (
        <>
          <SubTitle>Options des véhicules (conducteur)</SubTitle>
          <Spacer y={8} />
          <Row style={{ flexWrap: 'wrap' }}>
            {driverFeatures.map(f => (
              <Tag key={f.id}>{asTitleCase(f.name)}</Tag>
            ))}
          </Row>
        </>
      )}
    </AccessibleCard>
  );
}

/* =========================================================================================
 * Driver Section (vehicle, ratings, last seen, map, commissions)
 * =======================================================================================*/

function DriverSection({ user }: { user: User }) {
  if (!isDriverActive(user) || !user.driverProfile) return null;

  const dp: DriverProfile = user.driverProfile;

  const activeVehicle: Vehicle | undefined =
    dp.activeVehicle ?? safeArray(dp.vehicles).find(v => v?.status === 'ACTIVE');

  const ratingAvg = isFiniteNumber(dp.ratingAvg) ? dp.ratingAvg : undefined;
  const totalRatings = isFiniteNumber(dp.totalRatings) ? dp.totalRatings : 0;

  const lastSeenAt = dp.lastSeenAt;
  const isAvailable = !!dp.isAvailable;

  const canShowMap =
    isFiniteNumber(dp.currentLat) &&
    isFiniteNumber(dp.currentLng) &&
    Math.abs(dp.currentLat as number) <= 90 &&
    Math.abs(dp.currentLng as number) <= 180;

  return (
    <>
      <AccessibleCard title="Conducteur">
        <Row style={{ justifyContent: 'space-between' }}>
          <Row>
            <Ionicons name="car" size={20} color="#007AFF" style={{ marginRight: 8 }} />
            <SubTitle>Statut</SubTitle>
          </Row>
          <Row>
            <StatusPill
              kind={isAvailable ? 'success' : 'neutral'}
              text={isAvailable ? 'Disponible' : 'Indisponible'}
            />
          </Row>
        </Row>

        <Spacer y={8} />
        <InfoRow
          icon="time"
          label="Dernière activité"
          value={
            isNonEmptyString(lastSeenAt)
              ? `${ago(lastSeenAt)} • ${formatDateTimeShort(lastSeenAt)}`
              : '—'
          }
        />

        <Divider />

        <VehicleBlock vehicle={activeVehicle} allVehicles={safeArray(dp.vehicles)} />

        <Divider />

        <RatingsBlock avg={ratingAvg} total={totalRatings} />

        {canShowMap && (
          <>
            <Divider />
            <MapPreview lat={dp.currentLat as number} lng={dp.currentLng as number} />
          </>
        )}
      </AccessibleCard>

      <CommissionsSection commissions={safeArray(dp.commissions)} />
    </>
  );
}

function StatusPill({ kind, text }: { kind: 'success' | 'danger' | 'neutral'; text: string }) {
  const map: Record<typeof kind, { bg: string; fg: string }> = {
    success: { bg: '#E6F9EC', fg: '#18794E' },
    danger: { bg: '#FFE5E5', fg: '#B00020' },
    neutral: { bg: '#EFEFF4', fg: '#1C1C1E' },
  } as const;

  return (
    <View
      style={{
        backgroundColor: map[kind].bg,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
      }}>
      <Text style={{ color: map[kind].fg, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}

function VehicleBlock({ vehicle, allVehicles }: { vehicle?: Vehicle; allVehicles: Vehicle[] }) {
  if (!vehicle) {
    return (
      <View>
        <SubTitle>Véhicule actif</SubTitle>
        <Spacer y={8} />
        <Muted>Aucun véhicule actif</Muted>
      </View>
    );
  }

  const colorDot = toHexOrName(vehicle.color);
  const plate = isNonEmptyString(vehicle.plate) ? vehicle.plate : '—';
  const status = vehicleStatusLabel(vehicle.status);

  const category = vehicle.category;
  const categoryName = category?.name ?? '—';
  const maxPassengers = isFiniteNumber(category?.maxPassengers)
    ? category!.maxPassengers
    : undefined;
  const costPerKm = isFiniteNumber(category?.costPerKm) ? category!.costPerKm : undefined;

  const vehicleFeatures = safeArray(vehicle.accessibilityOptions)
    .map(va => va.feature)
    .filter(Boolean) as AccessibilityFeature[];

  return (
    <View>
      <SubTitle>Véhicule actif</SubTitle>
      <Spacer y={8} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Col style={{ flex: 1 }}>
          <Text style={styles.vehicleTitle}>{safeVehicleTitle(vehicle)}</Text>
          <Row style={{ marginTop: 6 }}>
            <Ionicons name="color-palette" size={16} color="#8E8E93" style={{ marginRight: 6 }} />
            <Text style={{ color: '#1C1C1E' }}>
              Couleur :{' '}
              <Text style={{ fontWeight: '500' }}>
                {isNonEmptyString(vehicle.color) ? asTitleCase(vehicle.color) : '—'}
              </Text>
            </Text>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: '#E5E5EA',
                backgroundColor: colorDot,
              }}
            />
          </Row>
          <Row style={{ marginTop: 6 }}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color="#8E8E93"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: '#1C1C1E' }}>
              Statut : <Text style={{ fontWeight: '500' }}>{status}</Text>
            </Text>
          </Row>
          <Row style={{ marginTop: 6 }}>
            <Ionicons name="document-text" size={16} color="#8E8E93" style={{ marginRight: 6 }} />
            <Text style={{ color: '#1C1C1E' }}>
              Immatriculation : <Text style={{ fontWeight: '500' }}>{plate}</Text>
            </Text>
          </Row>
          {!!maxPassengers && (
            <Row style={{ marginTop: 6 }}>
              <Ionicons name="people" size={16} color="#8E8E93" style={{ marginRight: 6 }} />
              <Text style={{ color: '#1C1C1E' }}>
                Catégorie : <Text style={{ fontWeight: '500' }}>{categoryName}</Text> ·{' '}
                {pluralize(maxPassengers, 'passager')}
                {isFiniteNumber(costPerKm) ? ` · ${costPerKm.toFixed(2)}€/km` : ''}
              </Text>
            </Row>
          )}
        </Col>
      </Row>

      {isNonEmptyArray(vehicleFeatures) && (
        <>
          <Spacer y={10} />
          <SubTitle>Accessibilité véhicule</SubTitle>
          <Spacer y={8} />
          <Row style={{ flexWrap: 'wrap' }}>
            {vehicleFeatures.map(f => (
              <Tag key={f.id}>{asTitleCase(f.name)}</Tag>
            ))}
          </Row>
        </>
      )}

      {/* All vehicles list (compact) */}
      {allVehicles.length > 1 && (
        <>
          <Spacer y={12} />
          <Muted>Autres véhicules ({allVehicles.length - 1})</Muted>
          <Spacer y={6} />
          {allVehicles
            .filter(v => v.id !== vehicle.id)
            .slice(0, 3)
            .map(v => (
              <Row key={v.id} style={{ justifyContent: 'space-between', paddingVertical: 6 }}>
                <Text style={{ color: '#1C1C1E' }}>{safeVehicleTitle(v)}</Text>
                <Muted>{vehicleStatusLabel(v.status)}</Muted>
              </Row>
            ))}
        </>
      )}
    </View>
  );
}

function RatingsBlock({ avg, total }: { avg?: number; total: number }) {
  return (
    <View>
      <SubTitle>Évaluations</SubTitle>
      <Spacer y={8} />
      <Row>
        <Ionicons name="star" size={18} color="#FFD60A" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 16, color: '#1C1C1E' }}>
          {isFiniteNumber(avg) ? avg!.toFixed(2) : '—'} / 5
        </Text>
        <Muted style={{ marginLeft: 8 }}>({total} avis)</Muted>
      </Row>
    </View>
  );
}

function MapPreview({ lat, lng }: { lat: number; lng: number }) {
  let MapView: any, Marker: any;
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch {
    MapView = null;
  }

  if (!MapView) {
    return (
      <View>
        <SubTitle>Dernière position connue</SubTitle>
        <Spacer y={8} />
        <Muted>
          Le module de carte n’est pas installé. Lat: {lat.toFixed(5)} · Lng: {lng.toFixed(5)}
        </Muted>
      </View>
    );
  }

  const region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View>
      <SubTitle>Dernière position connue</SubTitle>
      <Spacer y={8} />
      <View style={{ height: 180, borderRadius: 12, overflow: 'hidden' }}>
        <MapView style={{ flex: 1 }} initialRegion={region} pointerEvents="none">
          <Marker coordinate={{ latitude: lat, longitude: lng }}>
            <Ionicons name="navigate" size={28} color="#007AFF" />
          </Marker>
        </MapView>
      </View>
      <Muted style={{ marginTop: 6 }}>
        Lat: {lat.toFixed(5)} · Lng: {lng.toFixed(5)}
      </Muted>
    </View>
  );
}

function CommissionsSection({ commissions }: { commissions: DriverCommission[] }) {
  if (!isNonEmptyArray(commissions)) {
    return (
      <AccessibleCard title="Commissions">
        <Muted>Aucune commission configurée.</Muted>
      </AccessibleCard>
    );
  }

  const activeFirst = [...commissions].sort((a, b) => Number(b.active) - Number(a.active));

  return (
    <AccessibleCard title="Commissions">
      {activeFirst.slice(0, 5).map(c => {
        const typeLabel =
          c.type === 'PERCENTAGE'
            ? 'Pourcentage'
            : c.type === 'FIXED'
              ? 'Fixe'
              : c.type === 'MIXED'
                ? 'Mixte'
                : '—';

        const parts: string[] = [];
        if (isFiniteNumber(c.percentage)) parts.push(`${c.percentage!.toFixed(0)}%`);
        if (isFiniteNumber(c.fixedFee)) parts.push(`${c.fixedFee!.toFixed(2)}€`);
        const formula = parts.length ? parts.join(' + ') : '—';

        return (
          <Row key={c.id} style={{ justifyContent: 'space-between', paddingVertical: 8 }}>
            <Row>
              <Ionicons name="pricetags" size={16} color="#8E8E93" style={{ marginRight: 8 }} />
              <Text style={{ color: '#1C1C1E' }}>{typeLabel}</Text>
            </Row>
            <Row>
              <Muted style={{ marginRight: 10 }}>{formatDateShort(c.createdAt)}</Muted>
              <StatusPill
                kind={c.active ? 'success' : 'neutral'}
                text={c.active ? 'Actif' : 'Inactif'}
              />
            </Row>
            <Row style={{ position: 'absolute', left: 28, top: 28 }}>
              <Muted>Calcul : {formula}</Muted>
            </Row>
          </Row>
        );
      })}
      {commissions.length > 5 && (
        <>
          <Divider />
          <Muted>+ {commissions.length - 5} autres…</Muted>
        </>
      )}
    </AccessibleCard>
  );
}

/* =========================================================================================
 * Customer Section (contact + prioritized reservations)
 * =======================================================================================*/

function CustomerSection({ user }: { user: User }) {
  if (!isCustomerActive(user) || !user.customerProfile) return null;

  const reservations = safeArray(user.customerProfile.reservations);
  return <ReservationsSection reservations={reservations} />;
}

function sortAndPartitionReservations(reservations: Reservation[]) {
  const now = Date.now();

  const parseStart = (r: Reservation) => {
    const iso = (r as any).startAt || (r as any).pickupAt || (r as any).createdAt || '';
    const t = new Date(iso).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const withStart = reservations.map(r => ({ r, t: parseStart(r) }));

  const upcoming = withStart.filter(({ r, t }) => t > now);
  const active = withStart.filter(({ r, t }) => {
    const start = t;
    const endIso = (r as any).endAt || (r as any).dropoffAt;
    const end = Number.isFinite(new Date(endIso).getTime())
      ? new Date(endIso).getTime()
      : start + 2 * 60 * 60 * 1000;
    return start <= now && now <= end;
  });
  const past = withStart.filter(({ r, t }) => t <= now && !active.some(a => a.r === r));

  upcoming.sort((a, b) => a.t - b.t);
  active.sort((a, b) => a.t - b.t);
  past.sort((a, b) => b.t - a.t);

  return {
    active: active.map(x => x.r),
    upcoming: upcoming.map(x => x.r),
    past: past.map(x => x.r),
  };
}

function reservationTitle(r: Reservation): string {
  const from = (r as any).pickupAddress || (r as any).origin || '';
  const to = (r as any).dropoffAddress || (r as any).destination || '';
  if (isNonEmptyString(from) && isNonEmptyString(to)) return `${from} → ${to}`;
  if (isNonEmptyString(from)) return `${from}`;
  if (isNonEmptyString(to)) return `→ ${to}`;
  return `Réservation #${r.id}`;
}

function reservationWhen(r: Reservation): string {
  const start = (r as any).startAt || (r as any).pickupAt || (r as any).createdAt || '';
  const end = (r as any).endAt || (r as any).dropoffAt;
  if (isNonEmptyString(start) && isNonEmptyString(end)) {
    return `${formatDateTimeShort(start)} → ${formatDateTimeShort(end)}`;
  }
  if (isNonEmptyString(start)) return formatDateTimeShort(start);
  return '—';
}

function reservationStatus(r: Reservation): string {
  const s = (r as any).status as string | undefined;
  if (!isNonEmptyString(s)) return '—';
  const map: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminée',
    CANCELLED: 'Annulée',
  };
  return map[s] ?? asTitleCase(s);
}

function ReservationsSection({ reservations }: { reservations: Reservation[] }) {
  if (!isNonEmptyArray(reservations)) {
    return (
      <AccessibleCard title="Réservations">
        <Muted>Aucune réservation pour l’instant.</Muted>
      </AccessibleCard>
    );
  }

  const { active, upcoming, past } = sortAndPartitionReservations(reservations);
  const prioritized = [...active, ...upcoming, ...past];

  return (
    <AccessibleCard title="Réservations">
      {prioritized.slice(0, 6).map(r => (
        <ReservationRow key={r.id} r={r} />
      ))}

      {reservations.length > 6 && (
        <>
          <Divider />
          <Muted>+ {reservations.length - 6} autres…</Muted>
        </>
      )}
    </AccessibleCard>
  );
}

function ReservationRow({ r }: { r: Reservation }) {
  const title = reservationTitle(r);
  const when = reservationWhen(r);
  const status = reservationStatus(r);

  const price = (r as any).price as number | undefined;
  const pax = (r as any).passengers as number | undefined;

  return (
    <Row style={{ justifyContent: 'space-between', paddingVertical: 8 }}>
      <Col style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ color: '#1C1C1E', fontWeight: '500' }}>{title}</Text>
        <Muted>{when}</Muted>
        <Row style={{ marginTop: 4 }}>
          <StatusPill
            kind={
              status === 'En cours' || status === 'Confirmée'
                ? 'success'
                : status === 'Annulée'
                  ? 'danger'
                  : 'neutral'
            }
            text={status}
          />
          {isFiniteNumber(pax) && <Tag>{pluralize(pax!, 'passager')}</Tag>}
        </Row>
      </Col>
      <Col style={{ alignItems: 'flex-end' }}>
        {isFiniteNumber(price) ? (
          <Text style={{ fontWeight: '600' }}>{price!.toFixed(2)} €</Text>
        ) : (
          <Muted>—</Muted>
        )}
      </Col>
    </Row>
  );
}

/* =========================================================================================
 * Account Meta
 * =======================================================================================*/

function AccountMeta({ user }: { user: User }) {
  const created = formatDateShort(user.createdAt);
  const updated = formatDateShort(user.updatedAt);
  const role = user.role ?? RoleEnum.User;

  return (
    <AccessibleCard title="Compte">
      <InfoRow icon="informationCircle" label="Rôle (compte)" value={role} />
      <InfoRow icon="calendar" label="Créé le" value={created} />
      <InfoRow icon="timer" label="Modifié le" value={updated} />
      <InfoRow icon="clipboard" label="ID utilisateur" value={user.id} />
    </AccessibleCard>
  );
}

/* =========================================================================================
 * Styles
 * =======================================================================================*/

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: { paddingVertical: 20 },
  title: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  vehicleTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
});
