import React from 'react';
import { JobPost, Application, ApplicationStatus } from '../../types';

interface JobStatsProps {
  jobs: JobPost[];
  applications: Application[];
}

const JobStats: React.FC<JobStatsProps> = ({ jobs, applications }) => {
  const stats = React.useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'AVAILABLE').length;
    const closedJobs = jobs.filter(job => job.status === 'CLOSED').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'PENDING').length;
    const approvedApplications = applications.filter(app => app.status === 'APPROVED').length;
    const rejectedApplications = applications.filter(app => app.status === 'REJECTED').length;

    // Calculate applications per job category
    const jobCategories: Record<string, { jobs: number; applications: number }> = jobs.reduce((acc, job) => {
      const category = job.title.toLowerCase().includes('kitchen') ? 'Kitchen' :
                      job.title.toLowerCase().includes('lab') ? 'Laboratory' :
                      job.title.toLowerCase().includes('sports') ? 'Sports' :
                      job.title.toLowerCase().includes('canteen') ? 'Canteen' :
                      job.title.toLowerCase().includes('stall') ? 'Stall' : 'Other';
      
      if (!acc[category]) acc[category] = { jobs: 0, applications: 0 };
      acc[category].jobs++;
      return acc;
    }, {} as Record<string, { jobs: number; applications: number }>);

    applications.forEach(app => {
      const job = jobs.find(j => j.id === app.jobId);
      if (job) {
        const category = job.title.toLowerCase().includes('kitchen') ? 'Kitchen' :
                        job.title.toLowerCase().includes('lab') ? 'Laboratory' :
                        job.title.toLowerCase().includes('sports') ? 'Sports' :
                        job.title.toLowerCase().includes('canteen') ? 'Canteen' :
                        job.title.toLowerCase().includes('stall') ? 'Stall' : 'Other';
        if (jobCategories[category]) {
          jobCategories[category].applications++;
        }
      }
    });

    return {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      jobCategories,
      approvalRate: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0,
    };
  }, [jobs, applications]);

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    subtitle?: string;
    color: string;
    trend?: number;
  }> = ({ title, value, subtitle, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  const BarChart: React.FC<{
    data: Array<{ label: string; value: number; max?: number }>;
    color?: string;
    height?: number;
  }> = ({ data, color = 'bg-primary-500', height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Job Categories</h3>
        <div className="space-y-3" style={{ height: `${height}px` }}>
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs font-medium text-gray-600 w-20 text-right">
                {item.label}
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gray-100 rounded-full" />
                <div
                  className={`absolute inset-0 ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-700">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChart: React.FC<{
    data: Array<{ label: string; value: number; color: string }>;
    size?: number;
  }> = ({ data, size = 200 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    const createPath = (value: number, index: number) => {
      const percentage = value / total;
      const angle = percentage * 360;
      const endAngle = currentAngle + angle;
      
      const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
      const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
      const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const path = [
        `M 50 50`,
        `L ${x1} ${y1}`,
        `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle = endAngle;
      return { path, percentage };
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Application Status</h3>
        <div className="flex items-center gap-6">
          <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {data.map((item, index) => {
                const { path } = createPath(item.value, index);
                return (
                  <path
                    key={index}
                    d={path}
                    fill={item.color}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-gray-600">
                  {item.label}: {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Job Statistics</h2>
      
      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          subtitle={`${stats.activeJobs} active`}
          color="text-blue-600"
          trend={12}
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          subtitle={`${stats.approvedApplications} approved`}
          color="text-green-600"
          trend={8}
        />
        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          subtitle={`${stats.approvedApplications}/${stats.totalApplications}`}
          color="text-purple-600"
          trend={5}
        />
        <StatCard
          title="Pending"
          value={stats.pendingApplications}
          subtitle="Awaiting review"
          color="text-orange-600"
          trend={-2}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={Object.entries(stats.jobCategories).map(([label, data]: [string, { jobs: number; applications: number }]) => ({
            label,
            value: data.jobs,
          }))}
        />
        
        <PieChart
          data={[
            { label: 'Pending', value: stats.pendingApplications, color: '#f59e0b' },
            { label: 'Approved', value: stats.approvedApplications, color: '#10b981' },
            { label: 'Rejected', value: stats.rejectedApplications, color: '#ef4444' },
          ]}
        />
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {applications.slice(0, 5).map((app, index) => (
            <div key={app.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div className={`w-2 h-2 rounded-full ${
                app.status === ApplicationStatus.APPROVED ? 'bg-green-500' :
                app.status === ApplicationStatus.REJECTED ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {jobs.find(j => j.id === app.jobId)?.title || 'Unknown Job'}
                </div>
                <div className="text-xs text-gray-500">
                  {app.status} • {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobStats;