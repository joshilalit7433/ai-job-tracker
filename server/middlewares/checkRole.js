export const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: `Access denied. Only ${role}s are allowed.`,
        success: false,
      });
    }
    next();
  };
};
