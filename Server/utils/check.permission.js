import UnauthorizedError from '../errors/unauthorized.error.js';

const checkPermission = (reqUser, resourceId) => {
  if (reqUser.role === 'ADMIN') return;
  if (reqUser.userId === resourceId.toString()) return;
  throw new UnauthorizedError('Not authorized to access this route!');
};

export default checkPermission;
