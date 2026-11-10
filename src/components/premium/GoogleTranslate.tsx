import { Globe } from 'lucide-react';
import { useData } from '../../context/DataContext';
export const GoogleTranslate = () => {
  const { language, setLanguage } = useData();
  return <label className="flex items-center gap-2 text-sm"><Globe size={16} /><span className="sr-only">Website language</span><select aria-label="Website language" value={language} onChange={event => setLanguage(event.target.value === 'bn' ? 'bn' : 'en')} className="rounded border p-2"><option value="en">English</option><option value="bn">বাংলা</option></select></label>;
};
