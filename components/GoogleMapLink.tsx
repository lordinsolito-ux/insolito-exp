import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

interface GoogleMapLinkProps {
  url: string;
  className?: string;
}

export const GoogleMapLink: React.FC<GoogleMapLinkProps> = ({ url, className = "" }) => {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`inline-flex items-center text-gold-400 hover:text-gold-300 text-xs uppercase tracking-widest border-b border-transparent hover:border-gold-400 transition-all pb-0.5 ${className}`}
    >
      <MapPin className="w-3 h-3 mr-1.5" />
      View Route
      <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
    </a>
  );
};
