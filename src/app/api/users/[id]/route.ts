import { NextRequest, NextResponse } from 'next/server';
import { userQueries } from '@/lib/database/queries';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await userQueries.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    return NextResponse.json({ user: userResponse });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    // Check if user exists
    const existingUser = await userQueries.findById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare updates
    const updates: any = {};
    
    if (email && email !== existingUser.email) {
      // Check if email is already taken
      const emailExists = await userQueries.findByEmail(email);
      if (emailExists && emailExists.id !== params.id) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      updates.email = email;
    }
    
    if (name) updates.name = name;
    if (role) updates.role = role;
    
    if (password) {
      updates.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await userQueries.update(params.id, updates);
    
    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;

    return NextResponse.json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user exists
    const existingUser = await userQueries.findById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user
    await userQueries.delete(params.id);

    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}