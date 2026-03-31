import * as Haptics from "expo-haptics";

export async function runSoftSuccessHaptic() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Ignore failures on unsupported devices or simulators.
  }
}

export async function runSelectionHaptic() {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Ignore failures on unsupported devices or simulators.
  }
}
