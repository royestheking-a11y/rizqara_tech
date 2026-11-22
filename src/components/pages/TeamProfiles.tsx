import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Linkedin, Mail, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import roster from '../../data/team-members.json';
import { SEO } from '../SEO';
import '../../styles/team-profiles.css';

type TeamMember = {
    slug: string;
    name: string;
    role: string;
    roleBn: string;
    bio: string;
    bioBn: string;
    focus: string[];
    image?: string;
    linkedin?: string;
    email?: string;
    phone?: string;
    story?: string;
};

export const teamMembers: TeamMember[] = roster;

export function TeamAvatar({ member }: { member: TeamMember }) {
    const [failed, setFailed] = useState(false);
    const initials = member.name.split(' ').slice(0, 2).map(part => part[0]).join('');
    return (
        <span className="rq-team-avatar" aria-hidden="true">
            {member.image && !failed
                ? <img src={member.image} alt="" width="120" height="120" loading="lazy" onError={() => setFailed(true)} />
                : initials}
        </span>
    );
}

export function TeamSection() {
    const { language } = useData();
    const bn = language === 'bn';
    return (
        <ul className="rq-team-grid">
            {teamMembers.map(member => (
                <li key={member.slug}>
                    <Link className="rq-team-card" to={`/${member.slug}`}>
                        <div className="rq-team-card-top">
                            <TeamAvatar member={member} />
                            <ArrowUpRight size={19} aria-hidden="true" />
                        </div>
                        <h3>{member.name}</h3>
                        <span className="rq-team-role">{bn ? member.roleBn : member.role}</span>
                        <p>{bn ? member.bioBn : member.bio}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export function TeamPage() {
    const { language } = useData();
    const bn = language === 'bn';
    return (
        <div className="rq-team-page">
            <SEO title="Meet the Team | RizQara Tech" description="Meet the people behind RizQara Tech and learn about their roles and areas of focus." canonical="https://www.rizqara.tech/team" />
            <header>
                <h1>{bn ? 'আমাদের টিম' : 'Meet the team'}</h1>
                <p>{bn ? 'রিজকারা টেকের সদস্যদের প্রোফাইল ও কাজের ক্ষেত্র দেখুন।' : 'Get to know the people who lead, design, build, and market our work.'}</p>
            </header>
            <TeamSection />
        </div>
    );
}

export function TeamProfile({ member }: { member: TeamMember }) {
    const { language } = useData();
    const bn = language === 'bn';
    const role = bn ? member.roleBn : member.role;
    const bio = bn ? member.bioBn : member.bio;
    const url = `https://www.rizqara.tech/${member.slug}`;
    const companyEmail = 'rizqaratech@gmail.com';
    const officePhone = '+8801343042761';
    const email = member.email || companyEmail;
    const phone = member.phone || officePhone;
    const displayedPhone = member.phone || '+880 1343-042761';

    return (
        <article className="rq-team-profile">
            <SEO title={`${member.name} — ${member.role} | RizQara Tech`} description={bio} canonical={url}
                image={member.image ? `https://www.rizqara.tech${member.image}` : undefined}
                schema={{ '@context': 'https://schema.org', '@type': 'Person', name: member.name, jobTitle: member.role, url,
                    worksFor: { '@type': 'Organization', name: 'RizQara Tech', url: 'https://www.rizqara.tech' },
                    ...(member.linkedin ? { sameAs: [member.linkedin] } : {}) }} />
            <Link to="/team" className="rq-profile-back"><ArrowLeft size={16} aria-hidden="true" />{bn ? 'সব সদস্য' : 'All team members'}</Link>
            <header className="rq-profile-header">
                <TeamAvatar member={member} />
                <div>
                    <h1>{member.name}</h1>
                    <p className="rq-team-role">{role} · RizQara Tech</p>
                </div>
                <Link className="rq-profile-message" to={`/contact?teamMember=${member.slug}`}>
                    <MessageSquare size={17} aria-hidden="true" />{bn ? 'বার্তা পাঠান' : 'Send a message'}
                </Link>
            </header>
            <div className="rq-profile-layout">
                <div className="rq-profile-panel">
                    <h2>{bn ? 'পরিচিতি' : 'About'}</h2>
                    <p>{bio}</p>
                    <h2>{bn ? 'বর্তমান ভূমিকা' : 'Current role'}</h2>
                    <div className="rq-profile-current"><BriefcaseBusiness size={18} aria-hidden="true" /><div><strong>{role}</strong><p>RizQara Tech</p></div></div>
                    <h2>{bn ? 'কাজের ক্ষেত্র' : 'Areas of focus'}</h2>
                    <ul className="rq-profile-focus">{member.focus.map(item => <li key={item}>{item}</li>)}</ul>
                    {member.story && <Link to={member.story} className="rq-profile-back">{bn ? 'আরও পড়ুন' : 'Read the founder’s story'} <ArrowUpRight size={16} aria-hidden="true" /></Link>}
                </div>
                <aside className="rq-profile-panel rq-profile-contact">
                    <h2>{bn ? 'যোগাযোগ' : 'Contact'}</h2>
                    <a href={`mailto:${email}?subject=${encodeURIComponent(`For ${member.name}`)}`}>
                        <Mail size={17} aria-hidden="true" /><span>{member.email ? (bn ? 'ইমেইল' : 'Email') : (bn ? 'কোম্পানির ইমেইল' : 'Company email')}<small>{email}</small></span>
                    </a>
                    <a href={`tel:${phone}`}><Phone size={17} aria-hidden="true" /><span>{member.phone ? (bn ? 'ফোন' : 'Phone') : (bn ? 'অফিসে কল করুন' : 'Call the office')}<small>{displayedPhone}</small></span></a>
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={17} aria-hidden="true" />LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>}
                    {(!member.email || !member.phone) && <p>{bn ? 'কোম্পানির টিম আপনার বার্তা সংশ্লিষ্ট সদস্যের কাছে পৌঁছে দেবে।' : 'The company team can route your inquiry to this member.'}</p>}
                </aside>
            </div>
        </article>
    );
}
