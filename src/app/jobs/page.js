'use client';
useEffect(() => {
  fetchJobs();
}, [fetchJobs]);
import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Bookmark,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Search,
  Award,
  Target,
  Sparkles,
  ChevronRight,
  Building2,
  Calendar,
  BarChart3,
  Brain,
  Zap,
  BookmarkCheck,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Simulated user profile for matching
  const userProfile = {
    skills: ['React', 'Node.js', 'JavaScript', 'Python'],
    experience: 3,
    location: 'Remote',
    expectedSalary: 80000,
  };

  useEffect(() => {
    // Simulate fetching jobs from API
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    // Simulate API call
    setTimeout(() => {
      const fetchedJobs = [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          company: 'Tech Innovators',
          logo: 'TI',
          location: 'Remote',
          type: 'Full-time',
          salary: { min: 80000, max: 120000 },
          postedDays: 2,
          applicants: 45,
          skills: ['React', 'TypeScript', 'Next.js'],
          description: 'Build cutting-edge web applications with modern technologies.',
          experience: '3-5 years',
          benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
          industry: 'Technology',
          companySize: '500-1000',
        },
        {
          id: 2,
          title: 'Machine Learning Engineer',
          company: 'AI Labs',
          logo: 'AL',
          location: 'Bangalore, India',
          type: 'Hybrid',
          salary: { min: 100000, max: 150000 },
          postedDays: 5,
          applicants: 120,
          skills: ['Python', 'TensorFlow', 'PyTorch', 'ML'],
          description: 'Work on state-of-the-art AI models and deploy them at scale.',
          experience: '4-6 years',
          benefits: ['Health Insurance', 'Learning Budget', 'Flexible Hours'],
          industry: 'Artificial Intelligence',
          companySize: '100-500',
        },
        {
          id: 3,
          title: 'Backend Developer',
          company: 'Startup Hub',
          logo: 'SH',
          location: 'Remote',
          type: 'Contract',
          salary: { min: 60000, max: 90000 },
          postedDays: 1,
          applicants: 30,
          skills: ['Node.js', 'MongoDB', 'AWS', 'Docker'],
          description: 'Build scalable backend systems for high-traffic applications.',
          experience: '2-4 years',
          benefits: ['Flexible Hours', 'Remote Work'],
          industry: 'Technology',
          companySize: '10-50',
        },
        {
          id: 4,
          title: 'Full Stack Developer',
          company: 'Digital Solutions',
          logo: 'DS',
          location: 'New York, USA',
          type: 'Full-time',
          salary: { min: 90000, max: 130000 },
          postedDays: 3,
          applicants: 85,
          skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
          description: 'End-to-end development of enterprise applications.',
          experience: '3-5 years',
          benefits: ['Health Insurance', 'Gym Membership', '401k', 'PTO'],
          industry: 'Technology',
          companySize: '1000+',
        },
        {
          id: 5,
          title: 'DevOps Engineer',
          company: 'Cloud Systems',
          logo: 'CS',
          location: 'Remote',
          type: 'Full-time',
          salary: { min: 95000, max: 140000 },
          postedDays: 4,
          applicants: 67,
          skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
          description: 'Manage cloud infrastructure and CI/CD pipelines.',
          experience: '4-7 years',
          benefits: ['Remote Work', 'Learning Budget', 'Stock Options'],
          industry: 'Cloud Computing',
          companySize: '500-1000',
        },
      ];

      // Calculate match scores
      const jobsWithScores = fetchedJobs.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job),
      }));

      setJobs(jobsWithScores.sort((a, b) => b.matchScore - a.matchScore));
      setLoading(false);
    }, 1000);
  };

  const calculateMatchScore = (job) => {
    let score = 0;

    // Skill match (40 points)
    const matchingSkills = job.skills.filter(skill => 
      userProfile.skills.some(us => us.toLowerCase() === skill.toLowerCase())
    );
    score += (matchingSkills.length / job.skills.length) * 40;

    // Location match (20 points)
    if (job.location.includes(userProfile.location)) score += 20;

    // Salary match (20 points)
    if (job.salary.min <= userProfile.expectedSalary && job.salary.max >= userProfile.expectedSalary) {
      score += 20;
    }

    // Job freshness (10 points)
    score += Math.max(10 - job.postedDays, 0);

    // Competition level (10 points)
    score += Math.max(10 - (job.applicants / 20), 0);

    return Math.min(Math.round(score), 100);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      alert('Application submitted successfully!');
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return { 
      bg: 'bg-emerald-50 dark:bg-emerald-900/30', 
      text: 'text-emerald-700 dark:text-emerald-400', 
      border: 'border-emerald-200 dark:border-emerald-800' 
    };
    if (score >= 60) return { 
      bg: 'bg-blue-50 dark:bg-blue-900/30', 
      text: 'text-blue-700 dark:text-blue-400', 
      border: 'border-blue-200 dark:border-blue-800' 
    };
    if (score >= 40) return { 
      bg: 'bg-amber-50 dark:bg-amber-900/30', 
      text: 'text-amber-700 dark:text-amber-400', 
      border: 'border-amber-200 dark:border-amber-800' 
    };
    return { 
      bg: 'bg-gray-50 dark:bg-gray-800', 
      text: 'text-gray-700 dark:text-gray-400', 
      border: 'border-gray-200 dark:border-gray-700' 
    };
  };

  const filters = [
    { id: 'all', label: 'All Jobs', icon: Briefcase },
    { id: 'best-match', label: 'Best Matches', icon: Sparkles },
    { id: 'remote', label: 'Remote Only', icon: MapPin },
    { id: 'saved', label: 'Saved Jobs', icon: BookmarkCheck },
    { id: 'applied', label: 'Applied', icon: Target },
  ];

  const filteredJobs = jobs.filter(job => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    switch (activeFilter) {
      case 'best-match':
        return job.matchScore >= 70;
      case 'remote':
        return job.location.toLowerCase().includes('remote');
      case 'saved':
        return savedJobs.includes(job.id);
      case 'applied':
        return appliedJobs.includes(job.id);
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-white dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Career Opportunities</h1>
              <p className="text-slate-600 dark:text-gray-400 mt-1">AI-powered job recommendations tailored for you</p>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">Total Jobs</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{jobs.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">Best Matches</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {jobs.filter(j => j.matchScore >= 70).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">Saved Jobs</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{savedJobs.length}</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                  <BookmarkCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">Applied</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{appliedJobs.length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Smart Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Smart Filters
              </h2>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      activeFilter === filter.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <filter.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{filter.label}</span>
                    </div>
                    {filter.id !== 'all' && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeFilter === filter.id
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
                          : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-400'
                      }`}>
                        {filter.id === 'best-match' && jobs.filter(j => j.matchScore >= 70).length}
                        {filter.id === 'remote' && jobs.filter(j => j.location.toLowerCase().includes('remote')).length}
                        {filter.id === 'saved' && savedJobs.length}
                        {filter.id === 'applied' && appliedJobs.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Career Insights
              </h3>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-slate-600 dark:text-gray-400 mb-1">Your Profile Strength</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">85%</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-slate-600 dark:text-gray-400 mb-1">Avg. Match Score</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(jobs.reduce((sum, job) => sum + job.matchScore, 0) / jobs.length)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Salary Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Salary Insights
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mb-1">Average Range</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">$80K - $125K</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">+12% vs last year</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-900 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const matchColors = getMatchColor(job.matchScore);
                const isSaved = savedJobs.includes(job.id);
                const isApplied = appliedJobs.includes(job.id);

                return (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Company Logo */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                          {job.logo}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <p className="text-slate-600 dark:text-gray-400 font-medium">{job.company}</p>
                                <span className="text-slate-400 dark:text-gray-600">•</span>
                                <span className="text-sm text-slate-500 dark:text-gray-500">{job.companySize} employees</span>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <Bookmark className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                              )}
                            </button>
                          </div>

                          {/* Job Details */}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                              <Briefcase className="w-4 h-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4" />
                              {job.postedDays} days ago
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg font-medium">
                              <DollarSign className="w-4 h-4" />
                              ${(job.salary.min / 1000)}K - ${(job.salary.max / 1000)}K
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-slate-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                            {job.description}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.map((skill, index) => {
                              const isMatching = userProfile.skills.some(us => 
                                us.toLowerCase() === skill.toLowerCase()
                              );
                              return (
                                <span
                                  key={index}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                                    isMatching
                                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                      : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                                  }`}
                                >
                                  {skill}
                                  {isMatching && <span className="ml-1">✓</span>}
                                </span>
                              );
                            })}
                          </div>

                          {/* Match Score & Actions */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${matchColors.bg} ${matchColors.text} ${matchColors.border}`}>
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-bold">{job.matchScore}% Match</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>{job.applicants} applicants</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {isApplied ? (
                                <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg font-semibold border-2 border-emerald-200 dark:border-emerald-800">
                                  <Target className="w-4 h-4" />
                                  Applied
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleApply(job.id)}
                                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  Apply Now
                                  <ArrowUpRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
                <Briefcase className="w-16 h-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-gray-400 text-lg font-medium">No jobs found</p>
                <p className="text-slate-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
