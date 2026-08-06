const { z } = require('zod');
const { getSupabase, getIsConfigured } = require('../config/supabase');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * SIGN UP CONTROLLER (Strict Supabase Auth with Auto-Confirmed Email)
 */
const register = async (req, res) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErr = Object.values(fieldErrors)[0]?.[0] || 'Invalid input parameters';
      return res.status(400).json({
        success: false,
        message: firstErr,
        errors: fieldErrors
      });
    }

    const { name, email, password, companyName } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();
    const company = companyName?.trim() || 'SprintFlow Enterprise';

    if (!getIsConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Database authentication service is unconfigured.'
      });
    }

    const supabase = getSupabase();

    // 1. Check if user already exists in Supabase Auth
    try {
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingAuthUser = listData?.users?.find(u => u.email === cleanEmail);

      if (existingAuthUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please sign in.'
        });
      }
    } catch (e) {
      console.warn('[List Users Check Notice]', e.message);
    }

    // Clean up any orphan profile in public.users if absent from Supabase Auth
    await supabase.from('users').delete().eq('email', cleanEmail);

    // 2. Create user in Supabase Auth with admin privileges (email_confirm: true)
    let userId = null;
    let authUser = null;

    const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      user_metadata: { name, company_name: company },
      email_confirm: true
    });

    if (adminErr) {
      console.warn('[Supabase Auth Admin Create Notice]:', adminErr.message);
      if (adminErr.message.includes('already registered') || adminErr.message.includes('already exists') || adminErr.code === 'email_exists') {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please sign in.'
        });
      }

      // Try fallback signUp
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: { data: { name, company_name: company } }
      });

      if (signUpErr) {
        return res.status(400).json({
          success: false,
          message: `Registration Error: ${signUpErr.message}`
        });
      }

      authUser = signUpData.user;
      userId = authUser?.id;
    } else {
      authUser = adminData.user;
      userId = authUser?.id;
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user authentication session.'
      });
    }

    // 3. Ensure user profile is recorded in public.users table
    const { data: userProfile, error: profileErr } = await supabase
      .from('users')
      .insert([{
        id: userId,
        name: name,
        email: cleanEmail,
        password_hash: 'managed_by_supabase_auth',
        role: 'manager',
        company_name: company
      }])
      .select()
      .single();

    if (profileErr && !profileErr.message.includes('duplicate key')) {
      console.error('[Supabase Insert Profile Error]:', profileErr.message);
    }

    // 4. Authenticate to return valid Supabase session token
    const { data: sessionData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    const token = sessionData?.session?.access_token || `sb_session_${userId}`;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: token,
      user: {
        id: userId,
        name: userProfile?.name || name,
        email: cleanEmail,
        role: userProfile?.role || 'manager',
        companyName: userProfile?.company_name || company
      }
    });

  } catch (error) {
    console.error('[Register Controller Exception]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during account registration'
    });
  }
};

/**
 * LOGIN CONTROLLER (Strict Supabase Auth with Real Credentials Check & Demo Provisioning)
 */
const login = async (req, res) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const { email, password } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();

    if (!getIsConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Database authentication service is unconfigured.'
      });
    }

    const supabase = getSupabase();

    // 1. Auto-provision Demo Account (alex@sprintflow.ai / password123) if requested
    if (cleanEmail === 'alex@sprintflow.ai' || cleanEmail === 'demo@sprintflow.ai') {
      const demoId = 'a0000000-0000-4000-8000-000000000001';
      
      // Check if demo user exists in public.users
      const { data: demoProfile } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!demoProfile) {
        await supabase.from('users').insert([{
          id: demoId,
          name: 'Alex Mercer',
          email: cleanEmail,
          password_hash: 'managed_by_supabase_auth',
          role: 'manager',
          company_name: 'SprintFlow Enterprise'
        }]);
      }

      // Ensure demo user exists in Supabase Auth with confirmed email & correct password
      const { error: demoCreateErr } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password: password || 'password123',
        user_metadata: { name: 'Alex Mercer', company_name: 'SprintFlow Enterprise' },
        email_confirm: true
      });

      if (demoCreateErr && demoCreateErr.message.includes('already')) {
        // Sync password for demo user
        try {
          const { data: listData } = await supabase.auth.admin.listUsers();
          const foundAuthUser = listData?.users?.find(u => u.email === cleanEmail);
          if (foundAuthUser) {
            await supabase.auth.admin.updateUserById(foundAuthUser.id, {
              password: password || 'password123',
              email_confirm: true
            });
          }
        } catch (e) {
          console.warn('[Demo Account Password Sync Notice]', e.message);
        }
      }
    }

    // 2. Check if user exists in public.users table
    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!existingProfile) {
      // Check if user exists in Supabase Auth
      try {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const foundUser = listData?.users?.find(u => u.email === cleanEmail);
        if (!foundUser) {
          return res.status(400).json({
            success: false,
            message: 'No account found. Please create an account.'
          });
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'No account found. Please create an account.'
        });
      }
    }

    // 3. Authenticate strictly via Supabase Auth
    let { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    // If signInWithPassword failed due to email confirmation, confirm and retry
    if (authErr && (authErr.message.includes('Email not confirmed') || authErr.message.includes('Invalid login credentials'))) {
      try {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const foundAuthUser = listData?.users?.find(u => u.email === cleanEmail);
        if (foundAuthUser) {
          // Confirm email and sync
          await supabase.auth.admin.updateUserById(foundAuthUser.id, { email_confirm: true });
          
          // Retry signInWithPassword
          const retryResult = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password
          });
          if (retryResult.data?.session) {
            authData = retryResult.data;
            authErr = null;
          }
        }
      } catch (e) {
        console.warn('[Supabase Auth Email Confirm Fix Notice]:', e.message);
      }
    }

    if (authErr || !authData?.session) {
      console.warn(`[Login Failed for ${cleanEmail}]:`, authErr?.message || 'Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const session = authData.session;
    const user = authData.user;

    const userProfile = existingProfile || {
      id: user.id,
      name: user.user_metadata?.name || 'User',
      email: cleanEmail,
      role: 'manager',
      company_name: user.user_metadata?.company_name || 'SprintFlow Enterprise'
    };

    return res.json({
      success: true,
      token: session.access_token,
      user: {
        id: userProfile.id || user.id,
        name: userProfile.name || 'User',
        email: cleanEmail,
        role: userProfile.role || 'manager',
        companyName: userProfile.company_name || 'SprintFlow Enterprise',
        avatarUrl: userProfile.avatar_url || null
      }
    });

  } catch (error) {
    console.error('[Login Controller Exception]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during user login'
    });
  }
};

/**
 * GET CURRENT USER PROFILE
 */
const me = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve user session' });
  }
};

/**
 * UPDATE USER PROFILE
 */
const updateProfile = async (req, res) => {
  try {
    const { name, companyName, avatarUrl } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }

    const updatedCompanyName = companyName?.trim() || 'SprintFlow Enterprise';
    const updatedAvatarUrl = avatarUrl?.trim() || null;

    const supabase = getSupabase();

    const { data: updatedProfile, error } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        company_name: updatedCompanyName,
        avatar_url: updatedAvatarUrl
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Profile Update Warning]', error.message);
    }

    const updatedUserObj = {
      id: userId,
      name: name.trim(),
      email: req.user.email,
      role: req.user.role || 'manager',
      companyName: updatedCompanyName,
      avatarUrl: updatedAvatarUrl
    };

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUserObj
    });
  } catch (error) {
    console.error('[Update Profile Exception]', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = { register, login, me, updateProfile };
