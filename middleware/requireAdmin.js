const requireAdmin = (req, res, next) => {
  const user = res.locals.user;
  if (!user || !user?.isAdmin) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireAdmin;
