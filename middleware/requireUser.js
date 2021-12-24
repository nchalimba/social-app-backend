const requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.sendStatus(403);
  }
  return next();
};

export default requireUser;
