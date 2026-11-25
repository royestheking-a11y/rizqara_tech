import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import '../../styles/promotion-card.css';

interface PromotionCardProps {
    offerRate: string;
    serviceName: string;
    expiryDate: string;
    onClose?: () => void;
    onClaim?: () => void;
}

function discountRate(value: string) {
    const normalized = value.trim().replace(/[%٪]+\s*$/, '').trim();
    const rate = Number(normalized);
    return Number.isFinite(rate) && rate > 0 && rate <= 100 ? rate : null;
}

function expiryTime(value: string) {
    // Admin date inputs describe the final calendar day in Bangladesh.
    return Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T23:59:59.999+06:00` : value);
}

export function PromotionCard({ offerRate, serviceName, expiryDate, onClose, onClaim }: PromotionCardProps) {
    const bn = useData().language === 'bn';
    const rate = discountRate(offerRate);
    const locale = bn ? 'bn-BD' : 'en-US';
    const end = expiryTime(expiryDate);
    const formattedRate = rate === null ? '' : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format(rate / 100);
    const date = Number.isFinite(end) ? new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Asia/Dhaka' }).format(end) : '';
    const service = serviceName.trim() || (bn ? 'নির্বাচিত সেবা' : 'selected services');
    const title = rate === null ? (bn ? 'বিশেষ অফার' : 'Special offer')
        : bn ? `${service} সেবায় ${formattedRate} ছাড়` : `${formattedRate} off ${service}`;

    return (
        <aside className="rq-offer-card" aria-label={bn ? 'বিশেষ অফার' : 'Special offer'}>
            <div className="rq-offer-copy">
                <h2>{title}</h2>
                {date && <p>{bn ? 'অফারের শেষ দিন' : 'Offer ends'} <time dateTime={expiryDate}>{date}</time></p>}
            </div>
            <button className="rq-offer-action" type="button" onClick={onClaim} disabled={!onClaim}>
                {bn ? 'কোটের অনুরোধ করুন' : 'Request a quote'} <ArrowRight size={16} aria-hidden="true" />
            </button>
            {onClose && <button className="rq-offer-close" type="button" onClick={onClose} aria-label={bn ? 'অফার বন্ধ করুন' : 'Dismiss offer'}>
                <X size={19} aria-hidden="true" />
            </button>}
        </aside>
    );
}

export function PromotionOverlay() {
    const { language, promotion } = useData();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const end = expiryTime(promotion.expiryDate);
    const eligible = promotion.isActive && discountRate(promotion.offerRate) !== null && end > Date.now();

    useEffect(() => {
        if (!eligible) return;
        const timer = window.setTimeout(() => setVisible(true), 2000);
        const expiry = window.setInterval(() => { if (Date.now() >= end) setVisible(false); }, 30000);
        return () => { window.clearTimeout(timer); window.clearInterval(expiry); };
    }, [eligible, end]);

    if (!eligible || !visible) return null;

    function requestQuote() {
        setVisible(false);
        const service = promotion.serviceName.trim();
        const rate = discountRate(promotion.offerRate);
        try {
            sessionStorage.setItem('rizqaraGoalInquiry', JSON.stringify({
                subject: service ? `${service} — ${rate}% offer` : `Quote request — ${rate}% offer`,
                message: '',
            }));
        } catch { /* The contact form also works without a prefilled subject. */ }
        navigate('/contact');
    }

    return (
        <div className="rq-offer-placement">
            <PromotionCard offerRate={promotion.offerRate}
                serviceName={language === 'bn' ? promotion.serviceName_bn || promotion.serviceName : promotion.serviceName}
                expiryDate={promotion.expiryDate} onClose={() => setVisible(false)} onClaim={requestQuote} />
        </div>
    );
}
