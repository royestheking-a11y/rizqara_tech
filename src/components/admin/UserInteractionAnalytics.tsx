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
import { Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const UserInteractionAnalytics = ({ status, retry }: { status: 'loading' | 'ready' | 'error'; retry: () => void }) => {
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

    const totals = chartData.reduce((sum, row) => ({
        messages: sum.messages + row.messages,
        applications: sum.applications + row.applications,
    }), { messages: 0, applications: 0 });
    const total = totals.messages + totals.applications;

    return (
        <section className="rq-admin-report" aria-labelledby="rq-interactions-title" aria-busy={status === 'loading'}>
            <header className="rq-admin-report-header">
                <div>
                    <h2 id="rq-interactions-title"><Activity size={19} aria-hidden="true" /> User Interactions &amp; Pipeline</h2>
                    <p>Messages and job applications · Bangladesh time (UTC+6)</p>
                </div>
                <div className="rq-admin-report-periods" role="group" aria-label="Interaction reporting period">
                    {(['weekly', 'monthly', 'yearly'] as const).map(range => (
                        <button key={range} type="button" aria-pressed={timeRange === range} onClick={() => setTimeRange(range)}>
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </header>
            {status === 'loading' ? <p role="status" className="rq-admin-report-state">Loading interactions…</p>
                : status === 'error' ? <div role="alert" className="rq-admin-report-state rq-admin-report-state--error">
                    <span>Unable to load messages and applications.</span>
                    <button type="button" className="rq-admin-button rq-admin-button--secondary" onClick={retry}>Try again</button>
                </div>
                : <>
                    <dl className="rq-admin-stat-grid rq-admin-interaction-totals">
                        <div className="rq-admin-stat"><dt>Messages</dt><dd>{totals.messages}</dd></div>
                        <div className="rq-admin-stat"><dt>Job applications</dt><dd>{totals.applications}</dd></div>
                        <div className="rq-admin-stat"><dt>Total interactions</dt><dd>{total}</dd></div>
                    </dl>
                    {total === 0 ? <p role="status" className="rq-admin-report-state">No messages or job applications in this period.</p>
                        : <div className="rq-admin-report-chart">
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
                                name="Messages"
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
                        </div>}
                </>}
        </section>
    );
};
