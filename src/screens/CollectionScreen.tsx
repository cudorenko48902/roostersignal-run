import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import ClayCard from '../components/ClayCard';
import StickerBadge from '../components/StickerBadge';
import EmptyState from '../components/EmptyState';
import {COLORS, GRADIENTS, TABULAR} from '../constants/theme';
import {
  SLOTS_PER_SET,
  STICKER_SETS,
  TOTAL_STICKERS,
  isSetComplete,
  ownedInSet,
  stickerId,
} from '../game/stickers';
import type {Profile} from '../game/types';

interface Props {
  profile: Profile;
  onBack: () => void;
}

const SLOTS = Array.from({length: SLOTS_PER_SET}, (_, i) => i);

/** The album: six sets of four roadside stickers. */
export function CollectionScreen({profile, onBack}: Props) {
  const owned = profile.stickers;

  return (
    <ScreenBackground
      colors={GRADIENTS.menu as unknown as string[]}
      imageOpacity={0.18}
      blobs={[
        {colour: COLORS.amber, size: 280, opacity: 0.08, top: 60, left: -80},
        {colour: COLORS.go, size: 220, opacity: 0.06, bottom: -50, right: -70},
      ]}>
      <ScreenHeader
        title="COLLECTION"
        onBack={onBack}
        rightSlot={
          <Text style={styles.counter}>
            {`${owned.length} / ${TOTAL_STICKERS}`}
          </Text>
        }
      />

      <View style={styles.body}>
        {owned.length === 0 ? (
          <EmptyState
            title="NOTHING COLLECTED YET"
            body="STICKERS SIT ON THE SAFE LANES. CROSS ON GREEN TO FIND THEM."
          />
        ) : null}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {STICKER_SETS.map(set => {
            const complete = isSetComplete(owned, set.id);
            return (
              <ClayCard
                key={set.id}
                radius={24}
                accent={complete ? set.tint : null}
                style={styles.panel}>
                <View style={styles.panelTop}>
                  <Text style={styles.panelName} numberOfLines={1}>
                    {set.name}
                  </Text>
                  <Text style={[styles.panelCount, {color: set.tint}]}>
                    {complete
                      ? '★ COMPLETE'
                      : `${ownedInSet(owned, set.id)} / ${SLOTS_PER_SET}`}
                  </Text>
                </View>
                <View style={styles.cells}>
                  {SLOTS.map(slot => (
                    <StickerBadge
                      key={slot}
                      tint={set.tint}
                      owned={owned.indexOf(stickerId(set.id, slot)) !== -1}
                      size={40}
                      cell={62}
                    />
                  ))}
                </View>
              </ClayCard>
            );
          })}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 12},
  scroll: {flex: 1},
  scrollContent: {paddingBottom: 24, gap: 12},
  panel: {padding: 14},
  panelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  panelName: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  panelCount: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    ...TABULAR,
  },
  cells: {flexDirection: 'row', justifyContent: 'space-between'},
  counter: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    ...TABULAR,
  },
});

export default CollectionScreen;
