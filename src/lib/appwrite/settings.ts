import { databases, DATABASE_ID, SETTINGS_COLLECTION_ID } from './client';
import { Query } from 'appwrite';

// Use a fixed document ID for settings
const SETTINGS_DOC_ID = 'delivery_settings';

export interface DeliverySettings {
  baseCharge: number;
  freeDeliveryThreshold: number;
  remoteAreaCharge: number;
  remoteAreas: string[];
}

export interface Settings {
  delivery: DeliverySettings;
}

const defaultSettings: Settings = {
  delivery: {
    baseCharge: 60,
    freeDeliveryThreshold: 2000,
    remoteAreaCharge: 40,
    remoteAreas: ['sylhet', 'chittagong', 'khulna', 'rajshahi', 'rangpur', 'barisal', 'mymensingh'],
  },
};

/**
 * Get delivery settings from the database
 * Falls back to default settings if not found
 */
export async function getDeliverySettings(): Promise<DeliverySettings> {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      SETTINGS_COLLECTION_ID,
      SETTINGS_DOC_ID
    );

    return {
      baseCharge: response.base_charge || defaultSettings.delivery.baseCharge,
      freeDeliveryThreshold: response.free_delivery_threshold || defaultSettings.delivery.freeDeliveryThreshold,
      remoteAreaCharge: response.remote_area_charge || defaultSettings.delivery.remoteAreaCharge,
      remoteAreas: response.remote_areas || defaultSettings.delivery.remoteAreas,
    };
  } catch (error) {
    // If document doesn't exist, return default settings
    console.log('Using default delivery settings');
    return defaultSettings.delivery;
  }
}

/**
 * Update delivery settings in the database
 */
export async function updateDeliverySettings(settings: DeliverySettings): Promise<void> {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      SETTINGS_COLLECTION_ID,
      SETTINGS_DOC_ID,
      {
        base_charge: settings.baseCharge,
        free_delivery_threshold: settings.freeDeliveryThreshold,
        remote_area_charge: settings.remoteAreaCharge,
        remote_areas: settings.remoteAreas,
      }
    );
  } catch (error: any) {
    // If document doesn't exist, create it
    if (error.code === 404) {
      await databases.createDocument(
        DATABASE_ID,
        SETTINGS_COLLECTION_ID,
        SETTINGS_DOC_ID,
        {
          base_charge: settings.baseCharge,
          free_delivery_threshold: settings.freeDeliveryThreshold,
          remote_area_charge: settings.remoteAreaCharge,
          remote_areas: settings.remoteAreas,
        }
      );
    } else {
      throw error;
    }
  }
}

/**
 * Initialize settings with default values if they don't exist
 */
export async function initializeSettings(): Promise<void> {
  try {
    await databases.getDocument(
      DATABASE_ID,
      SETTINGS_COLLECTION_ID,
      SETTINGS_DOC_ID
    );
  } catch (error) {
    // Create default settings
    await databases.createDocument(
      DATABASE_ID,
      SETTINGS_COLLECTION_ID,
      SETTINGS_DOC_ID,
      {
        base_charge: defaultSettings.delivery.baseCharge,
        free_delivery_threshold: defaultSettings.delivery.freeDeliveryThreshold,
        remote_area_charge: defaultSettings.delivery.remoteAreaCharge,
        remote_areas: defaultSettings.delivery.remoteAreas,
      }
    );
  }
}
