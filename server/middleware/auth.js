const jwt = require('jsonwebtoken');
const { getSupabase, getIsConfigured } = require('../config/supabase');

function toUuid(idStr) {
  if (!idStr) return '00000000-0000-4000-8000-000000000001';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(idStr)) return idStr;
  const cleanHex = idStr.replace(/[^0-9a-f]/gi, '').padEnd(12, '0').substring(0, 12);
  return `00000000-0000-4000-8000-${cleanHex}`;
}

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const supabase = getSupabase();

    // 1. Try Supabase auth.getUser(token)
    if (getIsConfigured()) {
      const { data: authUser, error: authErr } = await supabase.auth.getUser(token);
      if (authUser?.user) {
        const userObj = authUser.user;
        const userId = userObj.id;

        // Fetch user profile from public.users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        req.user = {
          id: userId,
          name: profile?.name || userObj.user_metadata?.name || 'User',
          email: userObj.email,
          role: profile?.role || 'manager',
          companyName: profile?.company_name || userObj.user_metadata?.company_name || 'SprintFlow Enterprise',
          avatarUrl: profile?.avatar_url || null
        };
        return next();
      }
    }

    // 2. Decode JWT payload if signed locally
    const jwtSecret = process.env.JWT_SECRET || 'vVK+wcM8EfUghoZKj0Py+feHl619ZCWQNlwjw9yux7ivtsxc4X6GGiJwo32ZPnroBczE2pz0jGHkLKSAqIwBzw==';
    let decoded = null;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
      decoded = jwt.decode(token);
    }

    if (decoded && (decoded.id || decoded.sub || decoded.email)) {
      const uId = toUuid(decoded.id || decoded.sub);
      
      if (getIsConfigured()) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', uId)
          .maybeSingle();

        if (profile) {
          req.user = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role || 'manager',
            companyName: profile.company_name || 'SprintFlow Enterprise',
            avatarUrl: profile.avatar_url || null
          };
          return next();
        }
      }

      req.user = {
        id: uId,
        name: decoded.name || 'User',
        email: decoded.email || 'user@sprintflow.ai',
        role: decoded.role || 'manager',
        companyName: decoded.companyName || 'SprintFlow Enterprise'
      };
      return next();
    }

    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE_ERROR]', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
  }
};

module.exports = { protect, toUuid };
