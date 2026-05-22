import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BlogHome from './pages/BlogHome';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import Dashboard from './pages/Dashboard';
import EC2Monitor from './pages/EC2Monitor';
import RDSMonitor from './pages/RDSMonitor';
import CloudWatchPage from './pages/CloudWatchPage';
import S3Backups from './pages/S3Backups';
import SNSAlerts from './pages/SNSAlerts';
import RecoveryPage from './pages/RecoveryPage';
import TrafficAnalytics from './pages/TrafficAnalytics';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Blog Routes */}
        <Route path="/" element={<BlogHome />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/editor" element={<PostEditor />} />
        <Route path="/editor/:id" element={<PostEditor />} />

        {/* AWS Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ec2" element={<EC2Monitor />} />
        <Route path="/rds" element={<RDSMonitor />} />
        <Route path="/cloudwatch" element={<CloudWatchPage />} />
        <Route path="/s3" element={<S3Backups />} />
        <Route path="/sns" element={<SNSAlerts />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/traffic" element={<TrafficAnalytics />} />
      </Routes>
    </Layout>
  );
}

export default App;
