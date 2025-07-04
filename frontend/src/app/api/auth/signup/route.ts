import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, businessName } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create user in Supabase Auth using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for now
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user profile in database
    try {
      const user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          name: name || null,
          businessName: businessName || null,
          timezone: 'UTC',
          stripeAccountEnabled: false,
          emailNotifications: true,
          smsNotifications: false,
          bookingPageEnabled: true,
        },
      })

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          businessName: user.businessName,
        },
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
