
import React, { useEffect, useState } from 'react';
import { getCurrentUser, isAdminUser } from '../services/auth';
import { ACADEMIC_REPORT, CHAPTER_ICONS, Language } from '../src/constants/constants.base';
import { getCurrentLanguage, getString, setCurrentLanguage } from '../src/constants/i18n';

interface ProjectInfoProps {
  onTabChange?: (tab: string) => void;
}

const LOCAL_KEY_EN = "project_info_custom_en";
const LOCAL_KEY_MY = "project_info_custom_my";
const VERSION_ID = "v2.0 Academic Report";

const ProjectInfo: React.FC<ProjectInfoProps> = ({ onTabChange }) => {
  const user = getCurrentUser();
  const isAdmin = isAdminUser(user);

  const [language, setLanguage] = useState<Language>(getCurrentLanguage());
  useEffect(() => {
    const handler = () => setLanguage(getCurrentLanguage());
    window.addEventListener('ej:languageChanged', handler as EventListener);
    return () => window.removeEventListener('ej:languageChanged', handler as EventListener);
  }, []);
  const [customEN, setCustomEN] = useState<string>("");
  const [customMY, setCustomMY] = useState<string>("");
  const [editing, setEditing] = useState(false);
  
  const [openChapterId, setOpenChapterId] = useState<number | null>(1);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [openDiagramId, setOpenDiagramId] = useState<number | null>(null);
  
  const [showDiagramViewer, setShowDiagramViewer] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState<any>(null);
  const [diagramImages, setDiagramImages] = useState<Record<number, string>>({});
  const [loadingDiagrams, setLoadingDiagrams] = useState<Record<number, boolean>>({});
  const [diagramOverrides, setDiagramOverrides] = useState<Record<number, { plantUmlCode?: string; svgUrl?: string; titleMy?: string; descriptionMy?: string; }>>({});

  useEffect(() => {
    setCustomEN(localStorage.getItem(LOCAL_KEY_EN) || "");
    setCustomMY(localStorage.getItem(LOCAL_KEY_MY) || "");

    const chapter3 = ACADEMIC_REPORT.find(ch => ch.id === 3);
    if (chapter3 && chapter3.umlDiagrams) {
      const overrides: Record<number, any> = {};
      for (const d of chapter3.umlDiagrams) {
        try {
          const key = `diagram_override_${d.id}`;
          const raw = localStorage.getItem(key);
          if (raw) overrides[d.id] = JSON.parse(raw);
        } catch (e) {}
      }
      setDiagramOverrides(overrides);
    }
  }, []);

  const loadDiagramImages = async () => {
    const chapter3 = ACADEMIC_REPORT.find(ch => ch.id === 3);
    if (chapter3 && chapter3.umlDiagrams) {
      for (const diagram of chapter3.umlDiagrams) {
        try {
          if (diagramImages[diagram.id]) continue;
          setLoadingDiagrams(prev => ({ ...prev, [diagram.id]: true }));
          const override = diagramOverrides[diagram.id];
          if (override?.svgUrl) {
            setDiagramImages(prev => ({ ...prev, [diagram.id]: override.svgUrl }));
          } else if (override?.plantUmlCode) {
            const imageUrl = getPlantUMLImageURL(override.plantUmlCode);
            const base64Image = await imageToBase64(imageUrl);
            setDiagramImages(prev => ({ ...prev, [diagram.id]: base64Image }));
          } else if ((diagram as any).svgUrl) {
            setDiagramImages(prev => ({ ...prev, [diagram.id]: (diagram as any).svgUrl }));
          } else if (diagram.plantUmlCode) {
            const imageUrl = getPlantUMLImageURL(diagram.plantUmlCode);
            const base64Image = await imageToBase64(imageUrl);
            setDiagramImages(prev => ({ ...prev, [diagram.id]: base64Image }));
          }
        } catch (error) {
          console.error(`Failed to load diagram ${diagram.id}:`, error);
        } finally {
          setLoadingDiagrams(prev => ({ ...prev, [diagram.id]: false }));
        }
      }
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLanguage(lang);
  };

  const saveText = () => {
    localStorage.setItem(LOCAL_KEY_EN, customEN);
    localStorage.setItem(LOCAL_KEY_MY, customMY);
    setEditing(false);
  };

  const textContent = language === 'en' ? customEN : customMY;

  const toggleChapter = (chapterId: number) => {
    if (openChapterId === chapterId) {
      setOpenChapterId(null);
      setOpenSectionId(null);
    } else {
      setOpenChapterId(chapterId);
      setOpenSectionId(null);
      if (chapterId === 3) {
        loadDiagramImages();
      }
    }
  };

  const toggleSection = (sectionId: string) => {
    if (openSectionId === sectionId) {
      setOpenSectionId(null);
    } else {
      setOpenSectionId(sectionId);
    }
  };

  const diagramTitle = (d: any) => {
    const override = diagramOverrides[d.id];
    if (language === 'ms' && override?.titleMy) return override.titleMy;
    if (language === 'ms' && d.titleMy) return d.titleMy;
    return d.title;
  };
  const diagramDescription = (d: any) => {
    const override = diagramOverrides[d.id];
    if (language === 'ms' && override?.descriptionMy) return override.descriptionMy;
    if (language === 'ms' && d.descriptionMy) return d.descriptionMy;
    return d.description;
  };

  const activeChapter = ACADEMIC_REPORT.find(ch => ch.id === openChapterId);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-6 text-left">
      {/* Quick Navigation - Mobile */}
      {onTabChange && (
        <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar bg-white border-b border-slate-100 pb-3 -mt-2 -mx-2 px-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex-shrink-0 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium"
          >
            🏠 {getString('home')}
          </button>
          <button
            onClick={() => onTabChange('info')}
            className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
          >
            ℹ️ {getString('info')}
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className="flex-shrink-0 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium"
          >
            ⚙️ {getString('settings')}
          </button>
        </div>
      )}

      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          {getString('info')}
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-[0.3em]">Cafe's Little Helper Project &bull; {VERSION_ID}</p>

        <div className="flex flex-wrap justify-center gap-2 pt-6">
          {ACADEMIC_REPORT.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => toggleChapter(chapter.id)}
              className={`px-5 py-3 rounded-2xl flex items-center space-x-3 transition-all duration-300 ${openChapterId === chapter.id
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 transform scale-105'
                  : 'bg-white text-slate-400 border border-purple-50 hover:bg-purple-50'
                }`}
            >
              <span className="text-xl">{CHAPTER_ICONS[chapter.id] || "📘"}</span>
              <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">{getString('chapter')} {chapter.id}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 pt-6">
           <div className="bg-slate-100/50 p-1 rounded-full border border-slate-200 flex overflow-hidden">
              <button onClick={() => handleLanguageChange('en')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
              <button onClick={() => handleLanguageChange('ms')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${language === 'ms' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>MS</button>
           </div>
        </div>
      </header>

      {!editing && (
        <div className="space-y-8 animate-in fade-in duration-700">
          {activeChapter && (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-purple-50 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                  <span className="text-[12rem]">{CHAPTER_ICONS[activeChapter.id]}</span>
               </div>
               <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                   {sanitizeText((language === 'ms' && activeChapter.titleMy) ? activeChapter.titleMy : activeChapter.title)}
                 </h2>
                 <p className="text-purple-600 font-bold text-sm md:text-lg opacity-80 leading-relaxed italic">
                   "{sanitizeText((language === 'ms' && activeChapter.descriptionMy) ? activeChapter.descriptionMy : activeChapter.description)}"
                 </p>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 pb-20">
            {activeChapter && activeChapter.sections.map((section) => {
              const sectionKey = `${activeChapter.id}-${section.id}`;
              const isOpen = openSectionId === sectionKey;

              return (
                <div key={section.id} className="bg-white rounded-[2rem] md:rounded-[3rem] border border-purple-50 shadow-xl overflow-hidden group">
                  <button className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-purple-50/30 transition-all" onClick={() => toggleSection(sectionKey)}>
                    <div className="flex items-start space-x-5 text-left">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        {activeChapter.id}.{section.id}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                          {sanitizeText((language === 'ms' && (section as any).titleMy) ? (section as any).titleMy : section.title)}
                        </h3>
                      </div>
                    </div>
                    <span className={`text-2xl text-purple-300 font-light transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>

                  {isOpen && (
                    <div className="px-8 pb-10 pt-4 border-t border-purple-50 animate-in slide-in-from-top duration-500">
                      <div className="prose max-w-none text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                        {(() => {
                          const localizedContent: any = (language === 'ms' && (section as any).contentMy) ? (section as any).contentMy : section.content;
                          if (Array.isArray(localizedContent)) {
                            return (
                              <ul className="space-y-4">
                                {localizedContent.map((paragraph: string, idx: number) => {
                                  const text = sanitizeText(paragraph);
                                  return (
                                    <li key={idx} className="flex items-start gap-3">
                                      <span className="text-purple-400 mt-1.5">•</span>
                                      <span>{text.startsWith('•') ? text.substring(1).trim() : text}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            );
                          }
                          return <p>{sanitizeText(localizedContent)}</p>;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* UML Special Section */}
            {activeChapter?.id === 3 && activeChapter.umlDiagrams && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                 {activeChapter.umlDiagrams.map(diagram => (
                   <div key={diagram.id} className="bg-white p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-purple-50 shadow-2xl space-y-6">
                      <div className="flex justify-between items-start">
                         <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{diagramTitle(diagram)}</h4>
                         <span className="text-2xl">📐</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-500 font-medium italic opacity-70">"{diagramDescription(diagram)}"</p>
                      <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100 flex items-center justify-center min-h-[300px]">
                         {diagramImages[diagram.id] ? (
                           <img src={diagramImages[diagram.id]} className="max-w-full rounded-xl shadow-lg" alt="" />
                         ) : (
                           <div className="flex flex-col items-center gap-3">
                              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Generating Diagram...</span>
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Mudah Alih (Bawah Terapung) */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[200]">
         <div className="bg-white/90 backdrop-blur-xl p-2 rounded-full border border-purple-100 shadow-2xl flex justify-between items-center gap-1">
           {ACADEMIC_REPORT.map(chapter => (
             <button 
              key={chapter.id}
              onClick={() => toggleChapter(chapter.id)}
              className={`flex-1 py-4 rounded-full flex flex-col items-center gap-0.5 transition-all duration-300 ${openChapterId === chapter.id ? 'bg-purple-600 text-white shadow-lg scale-105' : 'text-slate-400'}`}
             >
               <span className="text-xl leading-none">{chapter.icon}</span>
               <span className="text-[7px] font-black uppercase tracking-widest">Bab {chapter.id}</span>
             </button>
           ))}
         </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
