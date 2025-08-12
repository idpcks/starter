import { NextRequest, NextResponse } from 'next/server';
import { appSettingsQueries } from '@/lib/database/queries';
import { auth } from '@/auth';
import { checkPermission } from '@/utils/server-permissions';
import { Permission } from '@/types/permission';

// GET /api/settings - Get all app settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await appSettingsQueries.getAll();
    
    // Convert to key-value object for easier frontend consumption
    const settingsObject = settings.reduce((acc: any, setting: any) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST /api/settings - Update app settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has edit_settings permission
    const hasEditPermission = await checkPermission(Permission.EDIT_SETTINGS);
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    const updatedSetting = await appSettingsQueries.set(key, value);

    return NextResponse.json({
      success: true,
      setting: updatedSetting
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Batch update multiple settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has edit_settings permission
    const hasEditPermission = await checkPermission(Permission.EDIT_SETTINGS);
    if (!hasEditPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const settings = body.settings;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    const updatedSettings = [];
    for (const [key, value] of Object.entries(settings)) {
      const updatedSetting = await appSettingsQueries.set(key, value as string);
      updatedSettings.push(updatedSetting);
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error batch updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}