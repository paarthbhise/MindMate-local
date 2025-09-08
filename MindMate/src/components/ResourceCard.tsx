import type { ResourceItem } from "../lib/types";

interface ResourceCardProps {
  resource: ResourceItem;
  onClick?: () => void;
}

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const { icon, title, description, link, type } = resource;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === 'external') {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 group cursor-pointer">
      <div className="text-4xl mb-4 text-center">
        <span className="text-teal-500 group-hover:scale-110 transition-transform duration-300 ease-in-out inline-block">
          {icon}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        {description}
      </p>
      
      <button
        onClick={handleClick}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-all duration-300 ease-in-out font-medium shadow-md hover:shadow-lg"
      >
        {type === 'external' ? 'Learn More' : 'Start Exercise'}
      </button>
    </div>
  );
}
