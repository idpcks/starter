import { NextRequest, NextResponse } from 'next/server';
import { checkPermission } from '@/utils/server-permissions';
import { Permission } from '@/types/permission';

/**
 * Contoh route handler yang dilindungi dengan pemeriksaan izin server-side
 */
export async function GET(request: NextRequest) {
  // Periksa apakah pengguna memiliki izin yang diperlukan
  const hasAccess = await checkPermission(Permission.MANAGE_USERS);
  
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Unauthorized: Insufficient permissions' },
      { status: 403 }
    );
  }
  
  // Lanjutkan dengan logika endpoint jika memiliki izin
  return NextResponse.json(
    { 
      message: 'Admin data retrieved successfully',
      data: {
        stats: {
          totalUsers: 25,
          activeUsers: 18,
          inactiveUsers: 7
        }
      }
    },
    { status: 200 }
  );
}

/**
 * Contoh route handler POST yang dilindungi dengan pemeriksaan izin server-side
 */
export async function POST(request: NextRequest) {
  // Periksa apakah pengguna memiliki izin yang diperlukan
  const hasAccess = await checkPermission(Permission.MANAGE_USERS);
  
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Unauthorized: Insufficient permissions' },
      { status: 403 }
    );
  }
  
  try {
    const data = await request.json();
    
    // Lanjutkan dengan logika endpoint jika memiliki izin
    return NextResponse.json(
      { 
        message: 'Admin data created successfully',
        data: {
          id: 'new-id-123',
          ...data,
          createdAt: new Date().toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}