export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required before checking permissions',
        code: 'UNAUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Role "${req.user.role}" does not have permission to perform this action.`,
        code: 'FORBIDDEN_ROLE'
      });
    }

    next();
  };
};
