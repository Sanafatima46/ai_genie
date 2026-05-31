import { Navigate } from 'react-router-dom';

/** Legacy route — job matching lives at /job-finder */
export default function Jobs() {
  return <Navigate to="/job-finder" replace />;
}
