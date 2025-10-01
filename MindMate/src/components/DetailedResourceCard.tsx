import { Heart, Phone, MessageCircle, Star, ExternalLink } from "lucide-react";
import type { DetailedResource } from "@/lib/types";

interface DetailedResourceCardProps {
  resource: DetailedResource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ICONS: { [key: string]: React.ReactNode } = {
  phone: <Phone className="w-5 h-5" />,
  message: <MessageCircle className="w-5 h-5" />,
  external: <ExternalLink className="w-5 h-5" />,
};

export default function DetailedResourceCard({ resource, isFavorite, onToggleFavorite }: DetailedResourceCardProps) {
  const { title, description, category, contact, url, tags, icon } = resource;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          <p className="text-sm text-teal-500 font-medium mb-1">{category}</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <button onClick={() => onToggleFavorite(resource.id)} className="text-gray-400 hover:text-red-500 transition-colors duration-300">
          <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {ICONS[icon]} 
          <span>{contact}</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline flex items-center gap-1">
          <span>Visit</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}