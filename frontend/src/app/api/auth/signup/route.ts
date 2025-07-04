import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    const { email, password, name, businessName } = await request.json()
    console.log('Request data:', { email, name, businessName, passwordLength: password?.length })

    // Validate required fields
    if (!email || !password) {
      console.error('Missing required fields:', { email: !!email, password: !!password })
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if supabaseAdmin is properly configured
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured.')
      console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : 'Not set')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
      return NextResponse.json(
        { error: 'Authentication service not properly configured. Please check your Supabase service role key.' },
        { status: 500 }
      )
    }

    console.log('Supabase admin client configured successfully')

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
      console.log('Creating user profile in database for user:', authData.user.id)
      
      // Test database connection first
      await prisma.$connect()
      console.log('Database connection successful')
      
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

      console.log('User profile created successfully:', user.id)

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
      console.error('Database error details:', {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      })
      
      // Try to clean up the Supabase user if database creation failed
      try {
        console.log('Attempting to clean up Supabase user due to database error')
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('Supabase user cleanup successful')
      } catch (cleanupError) {
        console.error('Failed to cleanup Supabase user:', cleanupError)
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create user profile. Please ensure the database is properly configured.',
          details: dbError instanceof Error ? dbError.message : 'Database connection failed'
        },
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
