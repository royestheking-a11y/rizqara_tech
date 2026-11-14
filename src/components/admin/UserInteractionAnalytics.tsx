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
import { Activity, Mail, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export const UserInteractionAnalytics = () => {
    const { messages, careerApplications } = useData();
    const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

    const dateKey = (value: string | Date) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? ''
            : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    };

    const chartData = useMemo(() => {
        const today = new Date(`${dateKey(new Date())}T12:00:00+06:00`);
        const data = [];

        if (timeRange === 'weekly') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setUTCDate(today.getUTCDate() - i);
                const dateStr = dateKey(d);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Dhaka' });

                const msgCount = messages.filter(m => dateKey(m.date) === dateStr).length;
                const appCount = careerApplications.filter(a => dateKey(a.date) === dateStr).length;

                data.push({
                    name: dayName,
                    messages: msgCount,
                    applications: appCount,
                    total: msgCount + appCount
                });
            }
        } else if (timeRange === 'monthly') {
            for (let i = 3; i >= 0; i--) {
                const start = new Date(today);
                start.setUTCDate(today.getUTCDate() - (i * 7) - 6);
                const end = new Date(today);
                end.setUTCDate(today.getUTCDate() - (i * 7));

                const weekLabel = `Week ${4 - i}`;

                let msgCount = 0;
                let appCount = 0;

                messages.forEach(m => {
                    const mDate = dateKey(m.date);
                    if (mDate >= dateKey(start) && mDate <= dateKey(end)) msgCount++;
                });
                careerApplications.forEach(a => {
                    const aDate = dateKey(a.date);
                    if (aDate >= dateKey(start) && aDate <= dateKey(end)) appCount++;
                });

                data.push({
                    name: weekLabel,
                    messages: msgCount,
                    applications: appCount,
                    total: msgCount + appCount
                });
            }
        } else if (timeRange === 'yearly') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = dateKey(today).slice(0, 4);

            months.forEach((month, index) => {
                const targetPrefix = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
                const msgCount = messages.filter(m => dateKey(m.date).slice(0, 7) === targetPrefix).length;
                const appCount = careerApplications.filter(a => dateKey(a.date).slice(0, 7) === targetPrefix).length;

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

    const stats = useMemo(() => {
        const totalMessages = messages.length;
        const totalApps = careerApplications.length;
        const totalInteractions = totalMessages + totalApps;
        return { totalMessages, totalApps, totalInteractions };
    }, [messages, careerApplications]);

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_4px_24px_-4px_rgba(80,0,0,0.04)] border border-[#ebdce3] p-6 md:p-8 mb-8 overflow-hidden relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-[#f0e4eb]">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#500000]/10 flex items-center justify-center text-[#500000]">
                            <Activity size={18} />
                        </div>
                        <h2 className="text-xl font-bold text-[#230711] tracking-tight">User Interactions & Pipeline</h2>
                    </div>
                    <p className="text-xs font-medium text-[#8c6d7a] mt-1">Real-time incoming communications and job submissions</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex p-1 bg-[#fcf9fa] border border-[#e5d4dc] rounded-xl">
                    {(['weekly', 'monthly', 'yearly'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                                timeRange === range
                                    ? 'bg-gradient-to-r from-[#500000] to-[#781b37] text-white shadow-xs'
                                    : 'text-[#785967] hover:text-[#500000]'
                            }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#500000" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#500000" stopOpacity={0.01} />
                                </linearGradient>
                                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8c6239" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#8c6239" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2e6ee" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#8c6d7a', fontSize: 11, fontWeight: 500 }}
                                dy={8}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#8c6d7a', fontSize: 11, fontWeight: 500 }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                    borderRadius: '14px',
                                    border: '1px solid #ebdce3',
                                    boxShadow: '0 10px 25px -5px rgba(80, 0, 0, 0.1)',
                                    padding: '10px 14px'
                                }}
                                itemStyle={{ color: '#230711', fontWeight: 600, fontSize: '12px' }}
                                labelStyle={{ color: '#8c6d7a', marginBottom: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="messages"
                                stroke="#500000"
                                fillOpacity={1}
                                fill="url(#colorMessages)"
                                strokeWidth={2.5}
                                name="Inquiries"
                            />
                            <Area
                                type="monotone"
                                dataKey="applications"
                                stroke="#8c6239"
                                fillOpacity={1}
                                fill="url(#colorApps)"
                                strokeWidth={2.5}
                                name="Applications"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Sidebar */}
                <div className="flex flex-col gap-3 justify-center">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#faf4f7] to-[#ffffff] border border-[#ebdce3] shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-[#500000]/10 text-[#500000] flex items-center justify-center shrink-0">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#8c6d7a] font-bold uppercase tracking-[0.14em]">Total Messages</p>
                            <h4 className="text-xl font-extrabold text-[#230711] tracking-tight">{stats.totalMessages}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#faf4f7] to-[#ffffff] border border-[#ebdce3] shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-[#8c6239]/10 text-[#8c6239] flex items-center justify-center shrink-0">
                            <FileText size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#8c6d7a] font-bold uppercase tracking-[0.14em]">Job Applications</p>
                            <h4 className="text-xl font-extrabold text-[#230711] tracking-tight">{stats.totalApps}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#faf4f7] to-[#ffffff] border border-[#ebdce3] shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-[#065f46]/10 text-[#065f46] flex items-center justify-center shrink-0">
                            <Zap size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#8c6d7a] font-bold uppercase tracking-[0.14em]">Total Interactions</p>
                            <h4 className="text-xl font-extrabold text-[#230711] tracking-tight">{stats.totalInteractions}</h4>
                        </div>
                    </div>

                    {/* Visual Insight Bar */}
                    <div className="mt-2 bg-[#fcf9fa] p-4 rounded-xl border border-[#ebdce3]">
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[11px] font-bold text-[#634754] uppercase tracking-[0.12em]">Interaction Ratio</span>
                            <span className="text-[10px] font-semibold text-[#8c6d7a]">{stats.totalInteractions} total</span>
                        </div>
                        <div className="h-2 w-full bg-[#ebdbe3]/50 rounded-full overflow-hidden flex">
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
                                className="h-full bg-[#8c6239]"
                            />
                        </div>
                        <div className="flex justify-between mt-2.5 text-[11px] text-[#8c6d7a] font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#500000]"></span> Inquiries
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#8c6239]"></span> Careers
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
