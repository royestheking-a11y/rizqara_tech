import { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Activity, Mail, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export const UserInteractionAnalytics = () => {
    const { messages, careerApplications } = useData();
    const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

    // Helper to process data based on time range
    const chartData = useMemo(() => {
        const today = new Date();
        const data = [];

        if (timeRange === 'weekly') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

                const msgCount = messages.filter(m => m.date === dateStr).length;
                const appCount = careerApplications.filter(a => a.date === dateStr).length;

                data.push({
                    name: dayName,
                    messages: msgCount,
                    applications: appCount,
                    total: msgCount + appCount
                });
            }
        } else if (timeRange === 'monthly') {
            // Last 4 weeks (roughly)
            for (let i = 3; i >= 0; i--) {
                const start = new Date(today);
                start.setDate(today.getDate() - (i * 7) - 6);
                const end = new Date(today);
                end.setDate(today.getDate() - (i * 7));

                const weekLabel = `Week ${4 - i}`;

                let msgCount = 0;
                let appCount = 0;

                // Simple range check
                messages.forEach(m => {
                    const mDate = new Date(m.date);
                    if (mDate >= start && mDate <= end) msgCount++;
                });
                careerApplications.forEach(a => {
                    const aDate = new Date(a.date);
                    if (aDate >= start && aDate <= end) appCount++;
                });

                data.push({
                    name: weekLabel,
                    messages: msgCount,
                    applications: appCount,
                    total: msgCount + appCount
                });
            }
        } else if (timeRange === 'yearly') {
            // Last 12 months (or just current year months, let's do last 6 months for better visibility if data is sparse, or all 12)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            months.forEach((month, index) => {
                // Filter by month index (assuming current year for simplicity, or we check year too)
                // For a real app, ideally check year. We'll assume all data is relatively recent or we filter by current year.
                const currentYear = today.getFullYear();

                const msgCount = messages.filter(m => {
                    const d = new Date(m.date);
                    return d.getMonth() === index && d.getFullYear() === currentYear;
                }).length;

                const appCount = careerApplications.filter(a => {
                    const d = new Date(a.date);
                    return d.getMonth() === index && d.getFullYear() === currentYear;
                }).length;

                data.push({
                    name: month,
                    messages: msgCount,
                    applications: appCount,
                    total: msgCount + appCount
                });
            });
        }

        return data;
    }, [messages, careerApplications, timeRange]);

    // Calculate Totals for the Badge Display
    const stats = useMemo(() => {
        const totalMessages = messages.length;
        const totalApps = careerApplications.length;
        const totalInteractions = totalMessages + totalApps;

        // Simple "Trend" simulation (comparing last half of data to first half of current view could work, 
        // but let's just make it 0 since we might not have enough data for a real trend yet)
        const trend = 0;

        return { totalMessages, totalApps, totalInteractions, trend };
    }, [messages, careerApplications]);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-hidden relative">
            {/* Background Decorative Blob */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#500000] rounded-full opacity-[0.03] blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Activity className="text-[#500000]" size={28} />
                        User Interaction
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Real-time system engagement analytics</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    {['weekly', 'monthly', 'yearly'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === range
                                ? 'bg-white text-[#500000] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#500000" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#500000" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                allowDecimals={false} // Since we are counting integers
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '12px',
                                    border: '1px solid #f1f5f9',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                labelStyle={{ color: '#64748b', marginBottom: '8px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="applications"
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorApps)"
                                strokeWidth={2}
                                name="Applications"
                            />
                            <Area
                                type="monotone"
                                dataKey="messages"
                                stroke="#500000"
                                fillOpacity={1}
                                fill="url(#colorMessages)"
                                strokeWidth={3}
                                name="Messages"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Sidebar */}
                <div className="flex flex-col gap-4 justify-center">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 rounded-lg bg-red-500 bg-opacity-10 text-opacity-100 text-red-500">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Messages</p>
                            <div className="flex items-end gap-2">
                                <h4 className="text-xl font-bold text-gray-800">{stats.totalMessages}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 rounded-lg bg-blue-500 bg-opacity-10 text-opacity-100 text-blue-500">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Job Applications</p>
                            <div className="flex items-end gap-2">
                                <h4 className="text-xl font-bold text-gray-800">{stats.totalApps}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 rounded-lg bg-green-500 bg-opacity-10 text-opacity-100 text-green-500">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Interactions</p>
                            <div className="flex items-end gap-2">
                                <h4 className="text-xl font-bold text-gray-800">{stats.totalInteractions}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Visual Insight Bar */}
                    <div className="mt-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex justify-between">
                            Interaction Split
                        </h4>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: stats.totalInteractions > 0 ? `${(stats.totalMessages / stats.totalInteractions) * 100}%` : '0%' }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-[#500000]"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: stats.totalInteractions > 0 ? `${(stats.totalApps / stats.totalInteractions) * 100}%` : '0%' }}
                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#500000]"></div> Messages</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Applications</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
