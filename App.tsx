import Ionicons from "@expo/vector-icons/Ionicons";
import React, { ComponentProps, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";

import {
  ServiceKey,
  SpeedKey,
  activeDeliveries,
  coverageCities,
  dashboardMetrics,
  distanceBands,
  discountForVolume,
  formatRange,
  launchRoadmap,
  qualityTargets,
  quoteRange,
  servicePricing,
  targetSegments,
  volumeTiers,
  DistanceKey
} from "./src/businessPlan";
import { colors, radius, spacing } from "./src/theme";

type TabKey = "dashboard" | "book" | "track" | "contracts" | "ops";
type IconName = ComponentProps<typeof Ionicons>["name"];

const tabs: Array<{ key: TabKey; label: string; icon: IconName }> = [
  { key: "dashboard", label: "Home", icon: "grid-outline" },
  { key: "book", label: "Book", icon: "add-circle-outline" },
  { key: "track", label: "Track", icon: "navigate-outline" },
  { key: "contracts", label: "Accounts", icon: "briefcase-outline" },
  { key: "ops", label: "Ops", icon: "settings-outline" }
];

const serviceKeys = Object.keys(servicePricing) as ServiceKey[];
const speedKeys: SpeedKey[] = ["sameDay", "rush", "stat"];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [service, setService] = useState<ServiceKey>("medical");
  const [speed, setSpeed] = useState<SpeedKey>("rush");
  const [distance, setDistance] = useState<DistanceKey>("mid");
  const [volume, setVolume] = useState("28");
  const [pickup, setPickup] = useState("Banner clinic - Phoenix");
  const [dropoff, setDropoff] = useState("Reference lab - Scottsdale");
  const [notes, setNotes] = useState("Refrigerated sample, signature required");
  const [tempControl, setTempControl] = useState(true);
  const [chainOfCustody, setChainOfCustody] = useState(true);
  const [signature, setSignature] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(activeDeliveries[0].id);
  const [completedActions, setCompletedActions] = useState<Set<string>>(
    () => new Set(["Foundation-0", "Foundation-1", "Soft launch-0"])
  );
  const { width } = useWindowDimensions();
  const compact = width < 390;

  const monthlyVolume = Number.parseInt(volume, 10) || 0;
  const range = quoteRange(service, speed, distance, monthlyVolume);
  const discount = discountForVolume(monthlyVolume);
  const selected = activeDeliveries.find((delivery) => delivery.id === selectedDelivery) ?? activeDeliveries[0];

  const bookingSummary = useMemo(
    () => [
      tempControl ? "Temperature control" : "Ambient handling",
      chainOfCustody ? "Chain of custody" : "Standard POD",
      signature ? "Signature required" : "Drop-off photo",
      recurring ? "Recurring route" : "One-time run"
    ],
    [chainOfCustody, recurring, signature, tempControl]
  );

  function toggleAction(id: string) {
    setCompletedActions((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView style={styles.app} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>DX</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Phoenix Metro</Text>
            <Text style={styles.title} numberOfLines={1}>
              Desert Express Logistics
            </Text>
          </View>
          <IconButton icon="notifications-outline" label="Notifications" onPress={() => setActiveTab("track")} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === "dashboard" ? <DashboardScreen compact={compact} onBook={() => setActiveTab("book")} /> : null}
          {activeTab === "book" ? (
            <BookScreen
              service={service}
              speed={speed}
              distance={distance}
              volume={volume}
              pickup={pickup}
              dropoff={dropoff}
              notes={notes}
              range={range}
              discount={discount}
              bookingSummary={bookingSummary}
              tempControl={tempControl}
              chainOfCustody={chainOfCustody}
              signature={signature}
              recurring={recurring}
              setService={setService}
              setSpeed={setSpeed}
              setDistance={setDistance}
              setVolume={setVolume}
              setPickup={setPickup}
              setDropoff={setDropoff}
              setNotes={setNotes}
              setTempControl={setTempControl}
              setChainOfCustody={setChainOfCustody}
              setSignature={setSignature}
              setRecurring={setRecurring}
              onTrack={() => setActiveTab("track")}
            />
          ) : null}
          {activeTab === "track" ? (
            <TrackScreen selectedId={selectedDelivery} onSelect={setSelectedDelivery} selected={selected} />
          ) : null}
          {activeTab === "contracts" ? <ContractsScreen /> : null}
          {activeTab === "ops" ? (
            <OpsScreen completedActions={completedActions} onToggleAction={toggleAction} />
          ) : null}
        </ScrollView>

        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabItem, isActive ? styles.tabItemActive : null]}
              >
                <Ionicons name={tab.icon} size={22} color={isActive ? colors.teal : colors.muted} />
                <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : null]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DashboardScreen({ compact, onBook }: { compact: boolean; onBook: () => void }) {
  return (
    <View style={styles.screen}>
      <View style={styles.heroPanel}>
        <Text style={styles.eyebrow}>Q3 2026 launch command center</Text>
        <Text style={styles.heroTitle}>Same-day courier, medical transport, and auto parts routes.</Text>
        <Text style={styles.heroText}>
          Built from the business plan for a lean Phoenix B2B operation with live tracking, digital POD, and specialty
          courier workflows.
        </Text>
        <View style={styles.heroActions}>
          <Pressable style={styles.primaryButton} onPress={onBook} accessibilityRole="button">
            <Ionicons name="add-circle-outline" size={20} color={colors.surface} />
            <Text style={styles.primaryButtonText}>New quote</Text>
          </Pressable>
          <View style={styles.statusBadge}>
            <Ionicons name="time-outline" size={16} color={colors.green} />
            <Text style={styles.statusBadgeText}>Mon-Fri 6 AM-7 PM</Text>
          </View>
        </View>
      </View>

      <View style={[styles.metricGrid, compact ? styles.metricGridCompact : null]}>
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} helper={metric.helper} />
        ))}
      </View>

      <SectionTitle title="Service Mix" action="5 tiers" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {serviceKeys.map((key) => (
          <View key={key} style={styles.serviceCard}>
            <View style={[styles.serviceIcon, { backgroundColor: servicePricing[key].accent }]}>
              <Ionicons name={iconForService(key)} size={20} color={colors.surface} />
            </View>
            <Text style={styles.cardTitle}>{servicePricing[key].shortLabel}</Text>
            <Text style={styles.cardText} numberOfLines={3}>
              {servicePricing[key].description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <SectionTitle title="Coverage" action="40-mile radius" />
      <RouteMap />

      <SectionTitle title="Active Work" action="Today" />
      {activeDeliveries.slice(0, 2).map((delivery) => (
        <DeliveryRow key={delivery.id} delivery={delivery} selected={false} onPress={() => undefined} />
      ))}
    </View>
  );
}

function BookScreen(props: {
  service: ServiceKey;
  speed: SpeedKey;
  distance: DistanceKey;
  volume: string;
  pickup: string;
  dropoff: string;
  notes: string;
  range: [number, number];
  discount: number;
  bookingSummary: string[];
  tempControl: boolean;
  chainOfCustody: boolean;
  signature: boolean;
  recurring: boolean;
  setService: (value: ServiceKey) => void;
  setSpeed: (value: SpeedKey) => void;
  setDistance: (value: DistanceKey) => void;
  setVolume: (value: string) => void;
  setPickup: (value: string) => void;
  setDropoff: (value: string) => void;
  setNotes: (value: string) => void;
  setTempControl: (value: boolean) => void;
  setChainOfCustody: (value: boolean) => void;
  setSignature: (value: boolean) => void;
  setRecurring: (value: boolean) => void;
  onTrack: () => void;
}) {
  const service = servicePricing[props.service];
  const speed = service.speeds[props.speed];

  return (
    <View style={styles.screen}>
      <SectionTitle title="Book Delivery" action={service.shortLabel} />
      <View style={styles.segmentGroup}>
        {serviceKeys.map((key) => (
          <SegmentButton
            key={key}
            label={servicePricing[key].shortLabel}
            active={props.service === key}
            onPress={() => props.setService(key)}
          />
        ))}
      </View>

      <View style={styles.quotePanel}>
        <View style={styles.quoteTopLine}>
          <View>
            <Text style={styles.eyebrow}>Estimated quote</Text>
            <Text style={styles.quotePrice}>{formatRange(props.range)}</Text>
          </View>
          <View style={[styles.serviceIcon, { backgroundColor: service.accent }]}>
            <Ionicons name={iconForService(props.service)} size={22} color={colors.surface} />
          </View>
        </View>
        <Text style={styles.cardText}>
          {service.label} is priced for a {speed.window.toLowerCase()} delivery window.{" "}
          {props.discount > 0 ? `${Math.round(props.discount * 100)}% volume discount applied.` : "No volume discount applied yet."}
        </Text>
      </View>

      <SectionTitle title="Speed" action={speed.window} />
      <View style={styles.segmentGroup}>
        {speedKeys.map((key) => (
          <SegmentButton
            key={key}
            label={service.speeds[key].label}
            active={props.speed === key}
            onPress={() => props.setSpeed(key)}
          />
        ))}
      </View>

      <SectionTitle title="Distance" action={distanceBands.find((band) => band.key === props.distance)?.helper ?? ""} />
      <View style={styles.segmentGroup}>
        {distanceBands.map((band) => (
          <SegmentButton
            key={band.key}
            label={band.label}
            active={props.distance === band.key}
            onPress={() => props.setDistance(band.key)}
          />
        ))}
      </View>

      <View style={styles.formBlock}>
        <Field label="Pickup" value={props.pickup} onChangeText={props.setPickup} icon="arrow-up-circle-outline" />
        <Field label="Dropoff" value={props.dropoff} onChangeText={props.setDropoff} icon="arrow-down-circle-outline" />
        <Field
          label="Monthly deliveries"
          value={props.volume}
          onChangeText={props.setVolume}
          icon="repeat-outline"
          keyboardType="number-pad"
        />
        <Field label="Package notes" value={props.notes} onChangeText={props.setNotes} icon="clipboard-outline" multiline />
      </View>

      <SectionTitle title="Handling" action="POD options" />
      <View style={styles.switchList}>
        <ToggleRow label="Temperature control" value={props.tempControl} onValueChange={props.setTempControl} />
        <ToggleRow label="Chain of custody" value={props.chainOfCustody} onValueChange={props.setChainOfCustody} />
        <ToggleRow label="Signature required" value={props.signature} onValueChange={props.setSignature} />
        <ToggleRow label="Recurring route" value={props.recurring} onValueChange={props.setRecurring} />
      </View>

      <View style={styles.summaryPanel}>
        <Text style={styles.cardTitle}>Booking summary</Text>
        {props.bookingSummary.map((item) => (
          <View key={item} style={styles.summaryLine}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.green} />
            <Text style={styles.summaryText}>{item}</Text>
          </View>
        ))}
        <Pressable style={styles.primaryButtonWide} onPress={props.onTrack} accessibilityRole="button">
          <Ionicons name="navigate-outline" size={20} color={colors.surface} />
          <Text style={styles.primaryButtonText}>Save and track quote</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TrackScreen({
  selectedId,
  onSelect,
  selected
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  selected: (typeof activeDeliveries)[number];
}) {
  return (
    <View style={styles.screen}>
      <SectionTitle title="Track Deliveries" action="Live board" />
      {activeDeliveries.map((delivery) => (
        <DeliveryRow key={delivery.id} delivery={delivery} selected={delivery.id === selectedId} onPress={() => onSelect(delivery.id)} />
      ))}

      <View style={styles.detailPanel}>
        <View style={styles.detailHeader}>
          <View>
            <Text style={styles.eyebrow}>{selected.id}</Text>
            <Text style={styles.detailTitle}>{selected.client}</Text>
          </View>
          <Text style={styles.detailStatus}>{selected.status}</Text>
        </View>
        <RouteMap compact />
        <View style={styles.detailGrid}>
          <InfoItem label="Pickup" value={selected.pickup} icon="arrow-up-outline" />
          <InfoItem label="Dropoff" value={selected.dropoff} icon="arrow-down-outline" />
          <InfoItem label="ETA" value={selected.eta} icon="time-outline" />
          <InfoItem label="Driver" value={selected.driver} icon="person-outline" />
        </View>

        <SectionTitle title="Delivery Timeline" action={selected.vehicle} />
        <View style={styles.timeline}>
          {selected.steps.map((step, index) => {
            const complete = index < selected.steps.length - 1 || selected.status === "Delivered";

            return (
              <View key={step} style={styles.timelineRow}>
                <View style={[styles.timelineDot, complete ? styles.timelineDotComplete : null]} />
                <View style={styles.timelineCopy}>
                  <Text style={styles.timelineTitle}>{step}</Text>
                  <Text style={styles.timelineText}>
                    {complete ? "Recorded in dispatch log" : "Waiting for driver update"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <SectionTitle title="Proof" action={selected.proof} />
        <View style={styles.chipRow}>
          {selected.compliance.map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ContractsScreen() {
  return (
    <View style={styles.screen}>
      <SectionTitle title="Accounts" action="B2B growth" />
      <View style={styles.revenuePanel}>
        <Text style={styles.eyebrow}>Year 1 targets</Text>
        <Text style={styles.heroTitle}>Recurring medical and auto routes move break-even forward.</Text>
        <View style={styles.revenueGrid}>
          <InfoItem label="Conservative" value="$210K" icon="bar-chart-outline" />
          <InfoItem label="Optimistic" value="$280K-$350K" icon="trending-up-outline" />
        </View>
      </View>

      <SectionTitle title="Volume Pricing" action="Contracts" />
      {volumeTiers.map((tier) => (
        <View key={tier.label} style={styles.tierRow}>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>{tier.discount === 0 ? "0%" : `${Math.round(tier.discount * 100)}%`}</Text>
          </View>
          <View style={styles.tierCopy}>
            <Text style={styles.cardTitle}>{tier.label}</Text>
            <Text style={styles.cardText}>{tier.detail}</Text>
          </View>
          <Text style={styles.tierMinimum}>{tier.minimum}+ /mo</Text>
        </View>
      ))}

      <SectionTitle title="Target Segments" action="Phoenix" />
      {targetSegments.map((segment) => (
        <View key={segment.segment} style={styles.segmentRow}>
          <View style={styles.segmentIcon}>
            <Ionicons name="business-outline" size={20} color={colors.teal} />
          </View>
          <View style={styles.segmentCopy}>
            <Text style={styles.cardTitle}>{segment.segment}</Text>
            <Text style={styles.cardText}>{segment.opportunity}</Text>
          </View>
          <Text style={styles.segmentCount}>{segment.count}</Text>
        </View>
      ))}
    </View>
  );
}

function OpsScreen({
  completedActions,
  onToggleAction
}: {
  completedActions: Set<string>;
  onToggleAction: (id: string) => void;
}) {
  return (
    <View style={styles.screen}>
      <SectionTitle title="Operations" action="90-day launch" />
      <View style={styles.metricGrid}>
        {qualityTargets.map((target) => (
          <View key={target.label} style={styles.qualityCard}>
            <Text style={styles.eyebrow}>{target.label}</Text>
            <Text style={styles.qualityValue}>{target.current}</Text>
            <Text style={styles.cardText}>Target {target.target}</Text>
          </View>
        ))}
      </View>

      {launchRoadmap.map((phase) => (
        <View key={phase.phase} style={styles.roadmapPanel}>
          <View style={styles.roadmapHeader}>
            <View>
              <Text style={styles.eyebrow}>{phase.range}</Text>
              <Text style={styles.detailTitle}>{phase.phase}</Text>
            </View>
            <Ionicons name="flag-outline" size={22} color={colors.rust} />
          </View>
          {phase.actions.map((action, index) => {
            const id = `${phase.phase}-${index}`;
            const complete = completedActions.has(id);

            return (
              <Pressable key={id} style={styles.actionRow} onPress={() => onToggleAction(id)} accessibilityRole="checkbox">
                <Ionicons
                  name={complete ? "checkbox-outline" : "square-outline"}
                  size={22}
                  color={complete ? colors.green : colors.muted}
                />
                <Text style={[styles.actionText, complete ? styles.actionTextComplete : null]}>{action}</Text>
              </Pressable>
            );
          })}
          <View style={styles.milestone}>
            <Ionicons name="ribbon-outline" size={18} color={colors.gold} />
            <Text style={styles.milestoneText}>{phase.milestone}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.eyebrow}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.cardText}>{helper}</Text>
    </View>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.segmentButton, active ? styles.segmentButtonActive : null]}
    >
      <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  icon,
  keyboardType,
  multiline
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: IconName;
  keyboardType?: "default" | "number-pad";
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Ionicons name={icon} size={16} color={colors.teal} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline ? styles.inputMultiline : null]}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.line, true: colors.surfaceAlt }}
        thumbColor={value ? colors.teal : colors.muted}
      />
    </View>
  );
}

function DeliveryRow({
  delivery,
  selected,
  onPress
}: {
  delivery: (typeof activeDeliveries)[number];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.deliveryRow, selected ? styles.deliveryRowSelected : null]} onPress={onPress} accessibilityRole="button">
      <View style={[styles.serviceIcon, { backgroundColor: serviceColor(delivery.service) }]}>
        <Ionicons name={iconForDelivery(delivery.service)} size={19} color={colors.surface} />
      </View>
      <View style={styles.deliveryCopy}>
        <Text style={styles.cardTitle}>{delivery.client}</Text>
        <Text style={styles.cardText}>
          {delivery.id} - {delivery.pickup} to {delivery.dropoff}
        </Text>
      </View>
      <View style={styles.deliveryMeta}>
        <Text style={styles.deliveryStatus}>{delivery.status}</Text>
        <Text style={styles.cardText}>{delivery.eta}</Text>
      </View>
    </Pressable>
  );
}

function RouteMap({ compact }: { compact?: boolean }) {
  return (
    <View style={[styles.mapPanel, compact ? styles.mapPanelCompact : null]}>
      <View style={styles.mapGrid}>
        {coverageCities.map((city, index) => (
          <View key={city} style={[styles.cityPin, cityPinStyle(index)]}>
            <View style={styles.pinDot} />
            <Text style={styles.pinLabel}>{city}</Text>
          </View>
        ))}
        <View style={styles.routeStrokeOne} />
        <View style={styles.routeStrokeTwo} />
      </View>
    </View>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color={colors.teal} />
      <View style={styles.infoCopy}>
        <Text style={styles.eyebrow}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function IconButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Ionicons name={icon} size={22} color={colors.ink} />
    </Pressable>
  );
}

function iconForService(service: ServiceKey): IconName {
  const icons: Record<ServiceKey, IconName> = {
    standard: "cube-outline",
    medical: "medkit-outline",
    auto: "car-sport-outline",
    legal: "document-text-outline",
    pharmacy: "flask-outline"
  };

  return icons[service];
}

function iconForDelivery(service: string): IconName {
  if (service === "Medical") {
    return "medkit-outline";
  }

  if (service === "Auto") {
    return "car-sport-outline";
  }

  if (service === "Legal") {
    return "document-text-outline";
  }

  return "cube-outline";
}

function serviceColor(service: string) {
  if (service === "Medical") {
    return colors.green;
  }

  if (service === "Auto") {
    return colors.rust;
  }

  if (service === "Legal") {
    return colors.violet;
  }

  return colors.blue;
}

function cityPinStyle(index: number) {
  const positions = [
    { left: "38%", top: "56%" },
    { left: "67%", top: "25%" },
    { left: "55%", top: "65%" },
    { left: "78%", top: "52%" },
    { left: "65%", top: "78%" },
    { left: "24%", top: "38%" },
    { left: "16%", top: "24%" },
    { left: "77%", top: "72%" }
  ];

  return positions[index];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  app: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.background
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.rust,
    alignItems: "center",
    justifyContent: "center"
  },
  brandMarkText: {
    color: colors.surface,
    fontWeight: "900",
    letterSpacing: 0
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 104
  },
  screen: {
    gap: spacing.lg
  },
  heroPanel: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: 0
  },
  heroText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  primaryButton: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  primaryButtonWide: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 15
  },
  statusBadge: {
    minHeight: 36,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: colors.surfaceAlt
  },
  statusBadgeText: {
    color: colors.green,
    fontWeight: "800",
    fontSize: 12
  },
  metricGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  metricGridCompact: {
    flexDirection: "column"
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: "47%",
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line
  },
  metricValue: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: "900",
    marginTop: spacing.xs,
    letterSpacing: 0
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0
  },
  cardText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  sectionAction: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "800"
  },
  horizontalList: {
    gap: spacing.md,
    paddingRight: spacing.lg
  },
  serviceCard: {
    width: 158,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.sm
  },
  serviceIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center"
  },
  mapPanel: {
    height: 210,
    borderRadius: radius.md,
    backgroundColor: "#edf3ef",
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden"
  },
  mapPanelCompact: {
    height: 150,
    marginTop: spacing.md
  },
  mapGrid: {
    flex: 1,
    position: "relative"
  },
  cityPin: {
    position: "absolute",
    alignItems: "center",
    gap: 2
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: radius.round,
    backgroundColor: colors.teal,
    borderWidth: 2,
    borderColor: colors.surface
  },
  pinLabel: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 4,
    borderRadius: radius.sm
  },
  routeStrokeOne: {
    position: "absolute",
    left: "26%",
    top: "49%",
    width: "48%",
    height: 3,
    backgroundColor: colors.rust,
    transform: [{ rotate: "-18deg" }],
    opacity: 0.85
  },
  routeStrokeTwo: {
    position: "absolute",
    left: "49%",
    top: "58%",
    width: "27%",
    height: 3,
    backgroundColor: colors.gold,
    transform: [{ rotate: "24deg" }],
    opacity: 0.9
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line
  },
  deliveryRowSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.surfaceAlt
  },
  deliveryCopy: {
    flex: 1,
    minWidth: 0
  },
  deliveryMeta: {
    alignItems: "flex-end",
    gap: spacing.xs
  },
  deliveryStatus: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "900"
  },
  tabBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    minHeight: 66,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.xs
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minHeight: 54,
    borderRadius: radius.sm
  },
  tabItemActive: {
    backgroundColor: colors.surfaceAlt
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: colors.teal
  },
  segmentGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  segmentButton: {
    minHeight: 40,
    flexGrow: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentButtonActive: {
    borderColor: colors.teal,
    backgroundColor: colors.surfaceAlt
  },
  segmentText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.teal
  },
  quotePanel: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md
  },
  quoteTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  quotePrice: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0
  },
  formBlock: {
    gap: spacing.md
  },
  field: {
    gap: spacing.xs
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800"
  },
  input: {
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    fontSize: 15
  },
  inputMultiline: {
    minHeight: 84,
    paddingTop: spacing.md,
    textAlignVertical: "top"
  },
  switchList: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden"
  },
  toggleRow: {
    minHeight: 54,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toggleLabel: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 14
  },
  summaryPanel: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.sm
  },
  summaryLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  summaryText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700"
  },
  detailPanel: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.lg
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  detailTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  detailStatus: {
    color: colors.surface,
    backgroundColor: colors.green,
    borderRadius: radius.round,
    overflow: "hidden",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontSize: 12,
    fontWeight: "900"
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  infoItem: {
    flexBasis: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.line
  },
  infoCopy: {
    flex: 1,
    minWidth: 0
  },
  infoValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  timeline: {
    gap: spacing.md
  },
  timelineRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: colors.line,
    marginTop: 3
  },
  timelineDotComplete: {
    backgroundColor: colors.teal,
    borderColor: colors.teal
  },
  timelineCopy: {
    flex: 1,
    gap: 2
  },
  timelineTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900"
  },
  timelineText: {
    color: colors.muted,
    fontSize: 13
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt
  },
  chipText: {
    color: colors.teal,
    fontWeight: "800",
    fontSize: 12
  },
  revenuePanel: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md
  },
  revenueGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line
  },
  tierBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center"
  },
  tierBadgeText: {
    color: colors.surface,
    fontWeight: "900"
  },
  tierCopy: {
    flex: 1,
    minWidth: 0
  },
  tierMinimum: {
    color: colors.teal,
    fontWeight: "900",
    fontSize: 12
  },
  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line
  },
  segmentIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt
  },
  segmentCopy: {
    flex: 1,
    minWidth: 0
  },
  segmentCount: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    maxWidth: 84,
    textAlign: "right"
  },
  qualityCard: {
    flexGrow: 1,
    flexBasis: "47%",
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line
  },
  qualityValue: {
    color: colors.teal,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.xs
  },
  roadmapPanel: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md
  },
  roadmapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.xs
  },
  actionText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  actionTextComplete: {
    color: colors.muted,
    textDecorationLine: "line-through"
  },
  milestone: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#fff8eb"
  },
  milestoneText: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800"
  }
});
