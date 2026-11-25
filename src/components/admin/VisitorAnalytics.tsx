import { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Eye, Users, RefreshCw, BarChart3, ShieldCheck } from 'lucide-react';

type Summary = {
    restaurantViews?: number;
    actions?: { _id: string; count: number }[];
    totals: { views: number; visitors: number };
    daily: { _id: string; views: number }[];
    pages: { _id: string; views: number }[];
};

export function VisitorAnalytics() {
    const [days, setDays] = useState(7);
    const [refresh, setRefresh] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [data, setData] = useState<Summary | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setIsRefreshing(true);
        setError('');
        apiRequest(`analytics/summary?days=${days}`, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]), cache: 'no-store' })
            .then(r => r.json())
            .then(res => {
                if (controller.signal.aborted) return;
                setData(res);
                setIsRefreshing(false);
            })
            .catch(e => {
                if (!controller.signal.aborted) {
                    setError(e.name === 'TimeoutError' ? 'The report took too long to load. Try refreshing.' : e.message);
                    setIsRefreshing(false);
                }
            });
        return () => controller.abort();
    }, [days, refresh]);

    const maxDailyViews = data && data.daily.length > 0
        ? Math.max(...data.daily.map(d => d.views), 1)
        : 1;

    return (
        <section className="rq-admin-report" aria-labelledby="rq-traffic-title" aria-busy={isRefreshing}>
            <header className="rq-admin-report-header">
                <div>
                    <h2 id="rq-traffic-title"><BarChart3 size={19} aria-hidden="true" /> Website Traffic &amp; Audience</h2>
                    <p>Consented visits · Bangladesh time (UTC+6) · 90-day history</p>
                </div>
                <div className="rq-admin-report-controls">
                    <select
                        aria-label="Visitor reporting period"
                        value={days}
                        onChange={e => setDays(Number(e.target.value))}
                        className="rq-admin-report-select"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={28}>Last 28 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 90 Days</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setRefresh(n => n + 1)}
                        disabled={isRefreshing}
                        className="rq-admin-button rq-admin-button--secondary"
                        title="Refresh analytics"
                    >
                        <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                        <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
                    </button>
                </div>
            </header>

            {error ? (
                <div role="alert" className="rq-admin-report-state rq-admin-report-state--error">
                    Unable to load visitor data: {error}
                </div>
            ) : isRefreshing || !data ? (
                <div role="status" className="rq-admin-report-state">
                    <RefreshCw size={18} className="animate-spin" aria-hidden="true" />
                    <p className="text-sm font-medium text-[#8c6d7a]">Loading visitor analytics…</p>
                </div>
            ) : (
                <>
                    {/* Top Totals */}
                    <div className="rq-admin-report-totals">
                        <div className="rounded-2xl bg-gradient-to-br from-[#faf4f7] to-[#ffffff] border border-[#ecdce5] p-5 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-[#8c6d7a] uppercase tracking-[0.14em] mb-1">Total Page Views</p>
                                <div className="text-3xl font-black text-[#230711] tracking-tight">
                                    {Number(data.totals.views).toLocaleString()}
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#500000]/10 text-[#500000] flex items-center justify-center">
                                <Eye size={22} />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-[#faf4f7] to-[#ffffff] border border-[#ecdce5] p-5 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-[#8c6d7a] uppercase tracking-[0.14em] mb-1">Unique Browsers</p>
                                <div className="text-3xl font-black text-[#230711] tracking-tight">
                                    {Number(data.totals.visitors).toLocaleString()}
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#781b37]/10 text-[#781b37] flex items-center justify-center">
                                <Users size={22} />
                            </div>
                        </div>
                    </div>

                    <section aria-label="Growth actions" className="mb-8">
                        <h3 className="mb-3 font-bold">Growth actions</h3>
                        <div className="rq-admin-stat-grid">
                            {Object.entries({ estimate_completed: 'Estimates completed', estimate_shared: 'Estimate links copied', booking_clicked: 'Booking clicks', inquiry_sent: 'Inquiries sent', academy_sample_click: 'Sample-to-course clicks' }).map(([key, label]) => (
                                <div className="rq-admin-stat" key={key}>
                                    <strong>{data.actions?.find(action => action._id === key)?.count ?? 0}</strong>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section aria-label="Restaurant service activity" className="mb-8">
                        <h3 className="mb-3 font-bold">Restaurant service activity</h3>
                        <div className="rq-admin-stat-grid">
                            {[
                                ['Service page views', data.restaurantViews ?? 0],
                                ['Quote button clicks', data.actions?.find(action => action._id === 'restaurant_quote_clicked')?.count ?? 0],
                                ['Completed restaurant inquiries', data.actions?.find(action => action._id === 'restaurant_inquiry_sent')?.count ?? 0],
                            ].map(([label, count]) => <div className="rq-admin-stat" key={label}><strong>{count}</strong><span>{label}</span></div>)}
                        </div>
                    </section>
                    {data.totals.views === 0 ? (
                        <div className="text-center py-10 px-4 rounded-2xl bg-[#faf6f8] border border-dashed border-[#e6d5de]">
                            <p className="text-sm font-semibold text-[#5a3a49]">No recorded visits in this period.</p>
                            <p className="text-xs text-[#8c6d7a] mt-1 max-w-md mx-auto">
                                Tracking starts after deployment and analytics consent. Past traffic prior to consent enablement cannot be recovered.
                            </p>
                        </div>
                    ) : (
                        <div className="rq-admin-report-breakdown">
                            {/* Daily breakdown */}
                            <div className="bg-[#fcf9fa] border border-[#f0e4eb] rounded-2xl p-5">
                                <h3 className="text-xs font-bold text-[#634754] uppercase tracking-[0.12em] mb-4 flex items-center justify-between">
                                    <span>Daily Page Views</span>
                                    <span className="text-[10px] font-medium text-[#9a7d8c] lowercase">volume per day</span>
                                </h3>
                                <div className="space-y-3">
                                    {data.daily.map(row => {
                                        const pct = Math.max(4, Math.round((row.views / maxDailyViews) * 100));
                                        return (
                                            <div key={row._id} className="flex items-center gap-3 text-xs">
                                                <span className="w-20 font-mono text-[11px] text-[#785967] shrink-0 font-medium">{row._id}</span>
                                                <div className="flex-1 bg-[#ebdbe3]/40 h-3 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#500000] to-[#8d1d3f] rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="w-12 text-right font-bold text-[#230711]">{row.views}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Most viewed pages */}
                            <div className="bg-[#fcf9fa] border border-[#f0e4eb] rounded-2xl p-5">
                                <h3 className="text-xs font-bold text-[#634754] uppercase tracking-[0.12em] mb-4 flex items-center justify-between">
                                    <span>Most Viewed Pages</span>
                                    <span className="text-[10px] font-medium text-[#9a7d8c] lowercase">top destinations</span>
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-[#ebdbe3] text-[#8c6d7a] text-[10px] font-bold uppercase tracking-wider">
                                                <th className="text-left pb-2 font-bold">Page Route</th>
                                                <th className="text-right pb-2 font-bold">Views</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#f2e6ee]">
                                            {data.pages.slice(0, 10).map((row, idx) => (
                                                <tr key={row._id} className="hover:bg-white/80 transition-colors">
                                                    <td className="py-2.5 pr-2 font-mono text-[#422230] font-medium break-all flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded-full bg-[#ebdce3] text-[#500000] text-[9px] font-black flex items-center justify-center shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        <span>{row._id}</span>
                                                    </td>
                                                    <td className="py-2.5 text-right font-bold text-[#230711] whitespace-nowrap">
                                                        <span className="px-2 py-0.5 rounded-md bg-[#500000]/10 text-[#500000]">
                                                            {row.views}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-[#f0e4eb] flex items-center gap-2 text-[11px] text-[#8c6d7a]">
                        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                        <span>
                            Unique browsers are counted using anonymous browser tokens. No IP addresses, query parameters, or personal identities are stored. Excludes admin views.
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}
