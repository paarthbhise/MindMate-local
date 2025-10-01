import { useState, useEffect, useMemo } from "react";
import type { ResourceItem, DetailedResource } from "../lib/types";
import { useToast } from "@/hooks/use-toast";
import { Heart, Search, Filter, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import BreathingModal from "@/components/BreathingModal";
import { COUNTRY_RESOURCES } from "./resources/countryResources";
import ResourceCard from "@/components/ResourceCard";

const RESOURCES: ResourceItem[] = [
  {
    id: "breathing",
    icon: "🫁",
    title: "Breathing Exercises",
    description: "Guided breathing techniques to help calm anxiety and reduce stress",
    link: "#",
    type: "internal",
  },
  {
    id: "meditation",
    icon: "🧘‍♀️",
    title: "Meditation",
    description: "Mindfulness and meditation practices for inner peace and clarity",
    link: "https://www.headspace.com",
    type: "external",
  },
  {
    id: "professional",
    icon: "👩‍⚕️",
    title: "Professional Help",
    description: "Find qualified therapists and mental health professionals in your area",
    link: "https://www.psychologytoday.com",
    type: "external",
  },
  {
    id: "support-groups",
    icon: "🤝",
    title: "Support Groups",
    description: "Connect with others who understand your experiences and challenges",
    link: "https://www.nami.org",
    type: "external",
  },
  {
    id: "articles",
    icon: "📚",
    title: "Educational Articles",
    description: "Learn about mental health conditions, coping strategies, and wellness tips",
    link: "https://www.mentalhealth.gov",
    type: "external",
  },
  {
    id: "apps",
    icon: "📱",
    title: "Apps & Tools",
    description: "Helpful mobile apps and digital tools for mental wellness",
    link: "#",
    type: "internal",
  },
];

const DETAILED_RESOURCES: DetailedResource[] = [
  // Crisis Support
  {
    id: "suicide-prevention",
    title: "National Suicide Prevention Lifeline",
    description: "Free and confidential emotional support for people in suicidal crisis or emotional distress 24 hours a day, 7 days a week.",
    category: "Crisis Support",
    contact: "988",
    url: "https://suicidepreventionlifeline.org/",
    tags: ["crisis", "suicide", "24/7", "hotline", "free"],
    icon: "phone"
  },
  {
    id: "crisis-text",
    title: "Crisis Text Line",
    description: "Text-based crisis intervention for those in crisis. Text HOME to 741741 to reach the Crisis Text Line.",
    category: "Crisis Support",
    contact: "Text HOME to 741741",
    url: "https://www.crisistextline.org/",
    tags: ["crisis", "text", "24/7", "free", "anonymous"],
    icon: "message"
  },
  {
    id: "lgbtq-hotline",
    title: "LGBTQ National Hotline",
    description: "Confidential peer support for LGBTQ+ individuals and allies. Available 1-4pm EST Monday-Friday.",
    category: "Crisis Support", 
    contact: "1-888-843-4564",
    url: "https://www.lgbtqnationalhotline.org/",
    tags: ["lgbtq", "peer support", "identity", "crisis"],
    icon: "phone"
  },
  
  // Professional Therapy
  {
    id: "betterhelp",
    title: "BetterHelp",
    description: "Online therapy platform connecting you with licensed therapists for convenient, affordable mental health care.",
    category: "Professional Therapy",
    contact: "Online Platform",
    url: "https://www.betterhelp.com/",
    tags: ["therapy", "online", "licensed", "affordable", "convenient"],
    icon: "external"
  },
  {
    id: "psychology-today",
    title: "Psychology Today Therapist Finder",
    description: "Find licensed therapists, psychiatrists, and support groups in your area with detailed profiles and specialties.",
    category: "Professional Therapy",
    contact: "Directory Service",
    url: "https://www.psychologytoday.com/",
    tags: ["directory", "local", "therapist", "psychiatrist", "specialist"],
    icon: "external"
  },
  {
    id: "talkspace",
    title: "Talkspace",
    description: "Text, audio, and video therapy with licensed professionals. Flexible scheduling and affordable plans.",
    category: "Professional Therapy",
    contact: "Online Platform",
    url: "https://www.talkspace.com/",
    tags: ["therapy", "text", "video", "flexible", "licensed"],
    icon: "external"
  },

  // Self-Care & Mindfulness
  {
    id: "headspace-detailed",
    title: "Headspace",
    description: "Meditation and mindfulness app with guided sessions for stress, anxiety, sleep, and focus.",
    category: "Self-Care & Mindfulness",
    contact: "Mobile App",
    url: "https://www.headspace.com/",
    tags: ["meditation", "mindfulness", "stress", "anxiety", "sleep"],
    icon: "external"
  },
  {
    id: "calm",
    title: "Calm",
    description: "Sleep stories, meditation, and relaxation tools to help you stress less, sleep more, and live mindfully.",
    category: "Self-Care & Mindfulness",
    contact: "Mobile App",
    url: "https://www.calm.com/",
    tags: ["sleep", "meditation", "relaxation", "mindfulness", "stories"],
    icon: "external"
  },
  {
    id: "insight-timer",
    title: "Insight Timer",
    description: "Free meditation app with thousands of guided meditations, music tracks, and talks from experts.",
    category: "Self-Care & Mindfulness",
    contact: "Mobile App",
    url: "https://insighttimer.com/",
    tags: ["free", "meditation", "music", "community", "guided"],
    icon: "external"
  },

  // Support Communities
  {
    id: "nami-detailed",
    title: "National Alliance on Mental Illness (NAMI)",
    description: "NAMI provides advocacy, education, support and public awareness so that all individuals and families affected by mental illness can build better lives.",
    category: "Support Communities",
    contact: "(800) 950-NAMI (6264)",
    url: "https://www.nami.org/",
    tags: ["advocacy", "education", "support groups", "family", "community"],
    icon: "external"
  },
  {
    id: "mha",
    title: "Mental Health America",
    description: "Leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.",
    category: "Support Communities",
    contact: "(800) 273-8255",
    url: "https://www.mhanational.org/",
    tags: ["community", "nonprofit", "advocacy", "screening", "resources"],
    icon: "external"
  },
  {
    id: "seven-cups",
    title: "7 Cups",
    description: "Free emotional support through trained listeners and online therapy. Available 24/7 with a supportive community.",
    category: "Support Communities",
    contact: "Online Platform",
    url: "https://www.7cups.com/",
    tags: ["free", "emotional support", "listeners", "24/7", "community"],
    icon: "external"
  },

  // Educational Resources
  {
    id: "mental-health-first-aid",
    title: "Mental Health First Aid",
    description: "Learn how to help someone who is developing a mental health problem or experiencing a mental health crisis.",
    category: "Educational",
    contact: "Training Program",
    url: "https://www.mentalhealthfirstaid.org/",
    tags: ["training", "first aid", "education", "crisis response", "skills"],
    icon: "external"
  },
  {
    id: "mindtools",
    title: "MindTools",
    description: "Practical resources to help you develop management, leadership, and personal effectiveness skills.",
    category: "Educational",
    contact: "Online Learning",
    url: "https://www.mindtools.com/",
    tags: ["skills", "leadership", "management", "personal growth"],
    icon: "external"
  }
];

const CATEGORIES = [
  "All", 
  "Crisis Support", 
  "Professional Therapy", 
  "Self-Care & Mindfulness", 
  "Support Communities", 
  "Educational"
];

const ALL_RESOURCES: (DetailedResource & { country?: string })[] = [...DETAILED_RESOURCES, ...Object.values(COUNTRY_RESOURCES).flat()];

const COUNTRIES = ["Global", "India", "United Kingdom", "Canada", "Australia", "Germany", "France", "Brazil", "Japan", "Russia", "China", "Pakistan"];

export default function Resources() {
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteResources");
    return saved ? JSON.parse(saved) : [];
  });
  const [showDetailed, setShowDetailed] = useState(false);
  const { toast } = useToast();

  const handleResourceClick = (resource: ResourceItem) => {
    if (resource.id === "breathing") {
      setShowBreathingModal(true);
    } else if (resource.id === "apps") {
      toast({
        title: "Coming Soon!",
        description: "We\'re working on adding new apps and tools. Stay tuned!",
        variant: "default",
      });
    } else {
      window.open(resource.link, "_blank");
    }
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteResources");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const filteredDetailedResources = useMemo(() => {
    return ALL_RESOURCES.filter(resource => {
      const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCountry = selectedCountry === "Global" ? !resource.country || resource.country === "Global" : resource.country === selectedCountry;

      return matchesCategory && matchesSearch && matchesCountry;
    });
  }, [searchQuery, selectedCategory, selectedCountry]);

  const crisisResources = filteredDetailedResources.filter(r => r.category === "Crisis Support");
  const otherResources = filteredDetailedResources.filter(r => r.category !== "Crisis Support");

  const toggleFavorite = (resourceId: string) => {
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(id => id !== resourceId)
      : [...favorites, resourceId];
    
    setFavorites(newFavorites);
    localStorage.setItem("favoriteResources", JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(resourceId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(resourceId) ? "Resource removed from your favorites." : "Resource saved to your favorites.",
    });
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "phone": return <Phone className="w-5 h-5" />;
      case "message": return <MessageCircle className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mental Health Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find helpful tools and support for your wellbeing journey
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-1 flex">
              <button
                onClick={() => setShowDetailed(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !showDetailed 
                    ? "bg-teal-500 text-white" 
                    : "text-gray-600 dark:text-gray-300 hover:text-teal-500"
                }`}
              >
                Quick Access
              </button>
              <button
                onClick={() => setShowDetailed(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showDetailed 
                    ? "bg-teal-500 text-white" 
                    : "text-gray-600 dark:text-gray-300 hover:text-teal-500"
                }`}
              >
                Detailed Directory
              </button>
            </div>
          </div>
        </div>

        {!showDetailed ? (
          <>
            {/* Emergency Resources */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                  Crisis Support
                </h2>
              </div>
              <p className="text-red-600 dark:text-red-300 mb-4">
                If you're in crisis or having thoughts of self-harm, please reach out for immediate help:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    National Suicide Prevention Lifeline
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 font-mono text-lg">
                    988
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Crisis Text Line
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 font-mono text-lg">
                    Text HOME to 741741
                  </p>
                </div>
              </div>
            </div>

            {/* Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESOURCES.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onClick={() => handleResourceClick(resource)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Crisis Resources Section */}
            {crisisResources.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                    Crisis Support - Available 24/7
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {crisisResources.map((resource) => (
                    <div key={resource.id} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          {getIcon(resource.icon)}
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                            {resource.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleFavorite(resource.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`w-6 h-6 ${favorites.includes(resource.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-red-600 dark:text-red-400 font-semibold">
                          {resource.contact}
                        </p>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Get Help Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Resources */}
            {otherResources.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Support Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherResources.map((resource) => (
                    <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          {getIcon(resource.icon)}
                          <span className="ml-3 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-lg">
                            {resource.category}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleFavorite(resource.id)}
                          className="text-gray-400 hover:text-teal-500 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(resource.id) ? 'fill-teal-500 text-teal-500' : ''}`} />
                        </button>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {resource.contact}
                        </p>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Learn More
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredDetailedResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No resources found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Breathing Exercise Modal */}
      <BreathingModal
        isOpen={showBreathingModal}
        onClose={() => setShowBreathingModal(false)}
      />
    </div>
  );
}
