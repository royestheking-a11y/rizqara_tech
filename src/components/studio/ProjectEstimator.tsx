import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { trackGrowth } from '../../utils/growthAnalytics';
import { SEO } from '../SEO';
import '../../styles/project-estimator.css';

const scenarios = {
    website: { name: 'Business website', bn: 'ব্যবসার ওয়েবসাইট', budget: [1000, 3000], weeks: [3, 6], scope: 'A responsive site with editable pages and an inquiry form.' },
    app: { name: 'Mobile app', bn: 'মোবাইল অ্যাপ', budget: [4000, 9000], weeks: [8, 14], scope: 'A cross-platform app with sign-in and one core user workflow.' },
    system: { name: 'Business software', bn: 'ব্যবসার সফটওয়্যার', budget: [3000, 7500], weeks: [6, 12], scope: 'A staff dashboard with user roles, records, and one operational workflow.' },
};
type Scenario = keyof typeof scenarios;

function readScenario(value: string | null): Scenario {
    return value && Object.prototype.hasOwnProperty.call(scenarios, value) ? value as Scenario : 'website';
}

export function ProjectEstimator() {
    const [params, setParams] = useSearchParams();
    const [type, setType] = useState(readScenario(params.get('type')));
    const [expanded, setExpanded] = useState(params.get('scope') === 'extended');
    const [copyStatus, setCopyStatus] = useState('');
    const [manualLink, setManualLink] = useState('');
    const navigate = useNavigate();
    const { language } = useData();
    const bn = language === 'bn';
    const result = params.has('type') ? scenarios[readScenario(params.get('type'))] : null;
    const hasExtras = params.get('scope') === 'extended';
    const currency = new Intl.NumberFormat(bn ? 'bn-BD' : 'en-US', { maximumFractionDigits: 0 });
    const budget = result?.budget.map(value => currency.format(hasExtras ? value * 1.5 : value)).join('–');
    const timeline = result?.weeks.map(value => currency.format(value + (hasExtras ? 3 : 0))).join('–');

    function calculate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCopyStatus('');
        setManualLink('');
        setParams({ type, scope: expanded ? 'extended' : 'core' }, { replace: true });
        trackGrowth('estimate_completed');
    }

    async function copyEstimate() {
        const url = new URL(window.location.pathname, window.location.origin);
        url.search = new URLSearchParams({ type: readScenario(params.get('type')), scope: hasExtras ? 'extended' : 'core' }).toString();
        try {
            await navigator.clipboard.writeText(url.href);
            setCopyStatus(bn ? 'লিংক কপি হয়েছে।' : 'Estimate link copied.');
            trackGrowth('estimate_shared');
        } catch {
            setManualLink(url.href);
        }
    }

    function sendBrief() {
        if (!result) return;
        sessionStorage.setItem('rizqaraGoalInquiry', JSON.stringify({
            subject: `Planning inquiry: ${result.name}`,
            message: `Project: ${result.name}\nPlanning range: USD ${budget}\nTimeline: ${timeline} weeks\nInitial scope: ${result.scope}`,
        }));
        navigate('/contact');
    }

    return (
        <div className="rq-estimator">
            <SEO title="Software Project Estimator" description="Plan an initial budget, timeline, and scope for a website, mobile app, or business software project." canonical="https://www.rizqara.tech/estimate" image="https://www.rizqara.tech/images/projects/selected/pocketstock.webp" />
            <h1>{bn ? 'সফটওয়্যার প্রজেক্টের হিসাব' : 'Software project estimator'}</h1>
            <p>{bn ? 'ওয়েবসাইট, মোবাইল অ্যাপ বা ব্যবসার সফটওয়্যারের প্রাথমিক বাজেট ও সময় দেখুন।' : 'Get a planning range and a suggested first release for your website, app, or business software.'}</p>
            <div className="rq-estimator-layout">
                <form className="rq-estimator-panel" onSubmit={calculate}>
                    <label htmlFor="estimate-type">{bn ? 'প্রজেক্টের ধরন' : 'Project type'}</label>
                    <select id="estimate-type" value={type} onChange={event => setType(readScenario(event.target.value))}>
                        {Object.entries(scenarios).map(([key, item]) => <option value={key} key={key}>{bn ? item.bn : item.name}</option>)}
                    </select>
                    <label htmlFor="estimate-scope">{bn ? 'প্রাথমিক কাজের পরিধি' : 'First-release scope'}</label>
                    <select id="estimate-scope" value={expanded ? 'extended' : 'core'} onChange={event => setExpanded(event.target.value === 'extended')}>
                        <option value="core">{bn ? 'মূল কার্যপ্রবাহ' : 'Core workflow'}</option>
                        <option value="extended">{bn ? 'ইন্টিগ্রেশনসহ' : 'Core workflow plus integrations'}</option>
                    </select>
                    <button type="submit">{bn ? 'হিসাব দেখুন' : 'Calculate estimate'}</button>
                </form>
                <section className="rq-estimator-panel" aria-labelledby="estimate-result" aria-live="polite">
                    <h2 id="estimate-result">{bn ? 'প্রাথমিক হিসাব' : 'Planning estimate'}</h2>
                    {result ? <>
                        <div className="rq-estimator-figures"><strong>USD {budget}</strong><strong>{timeline} {bn ? 'সপ্তাহ' : 'weeks'}</strong></div>
                        <p>{result.scope} {hasExtras && 'Includes up to two standard integrations.'}</p>
                        <p>{bn ? 'এটি পরিকল্পনার জন্য। চূড়ান্ত মূল্য ও সময় কাজের পরিধির ওপর নির্ভর করে।' : 'Illustrative range for design and development. Hosting, third-party fees, taxes, and ongoing support are separate. Confirm scope before requesting a quote.'}</p>
                        <div className="rq-estimator-actions"><button type="button" onClick={copyEstimate}>{bn ? 'লিংক কপি করুন' : 'Copy estimate link'}</button><button type="button" onClick={sendBrief}>{bn ? 'প্রজেক্টের বিবরণ পাঠান' : 'Send a project brief'}</button></div>
                        {copyStatus && <p>{copyStatus}</p>}
                        {manualLink && <input aria-label="Estimate link" readOnly value={manualLink} onFocus={event => event.currentTarget.select()} />}
                    </> : <p>{bn ? 'প্রজেক্টের ধরন বেছে নিয়ে হিসাব করুন।' : 'Choose a project type and scope to see your range.'}</p>}
                </section>
            </div>
        </div>
    );
}
