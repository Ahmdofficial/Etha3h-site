import React, { createContext, useContext, useState, useEffect } from 'react';
import type { RadioTopic, RadioProgram } from '@/types';
import { initialTopics, initialPrograms } from '@/data/initialData';

interface RadioDataContextType {
  topics: RadioTopic[];
  programs: RadioProgram[];
  addTopic: (topic: Omit<RadioTopic, 'id' | 'createdAt'>) => void;
  updateTopic: (id: string, topic: Partial<RadioTopic>) => void;
  deleteTopic: (id: string) => void;
  getTopicById: (id: string) => RadioTopic | undefined;
  addProgram: (program: Omit<RadioProgram, 'id'>) => void;
  updateProgram: (id: string, program: Partial<RadioProgram>) => void;
  deleteProgram: (id: string) => void;
  getProgramsByDate: (date: string) => RadioProgram[];
  getProgramsByMonth: (month: number, year: number) => RadioProgram[];
  searchTopics: (query: string) => RadioTopic[];
  filterTopicsByCategory: (category: string) => RadioTopic[];
  resetData: () => void;
}

const RadioDataContext = createContext<RadioDataContextType | undefined>(undefined);

export function RadioDataProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<RadioTopic[]>(() => {
    const saved = localStorage.getItem('radio_topics');
    return saved ? JSON.parse(saved) : initialTopics;
  });

  const [programs, setPrograms] = useState<RadioProgram[]>(() => {
    const saved = localStorage.getItem('radio_programs');
    return saved ? JSON.parse(saved) : initialPrograms;
  });

  useEffect(() => {
    localStorage.setItem('radio_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('radio_programs', JSON.stringify(programs));
  }, [programs]);

  const addTopic = (topic: Omit<RadioTopic, 'id' | 'createdAt'>) => {
    const newTopic: RadioTopic = {
      ...topic,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTopics([...topics, newTopic]);
  };

  const updateTopic = (id: string, topic: Partial<RadioTopic>) => {
    setTopics(topics.map((t) => (t.id === id ? { ...t, ...topic } : t)));
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  const getTopicById = (id: string) => {
    return topics.find((t) => t.id === id);
  };

  const addProgram = (program: Omit<RadioProgram, 'id'>) => {
    const newProgram: RadioProgram = {
      ...program,
      id: Date.now().toString(),
    };
    setPrograms([...programs, newProgram]);
  };

  const updateProgram = (id: string, program: Partial<RadioProgram>) => {
    setPrograms(programs.map((p) => (p.id === id ? { ...p, ...program } : p)));
  };

  const deleteProgram = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const getProgramsByDate = (date: string) => {
    return programs.filter((p) => p.date === date);
  };

  const getProgramsByMonth = (month: number, year: number) => {
    return programs.filter((p) => {
      const date = new Date(p.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const searchTopics = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.introduction.toLowerCase().includes(lowerQuery)
    );
  };

  const filterTopicsByCategory = (category: string) => {
    if (category === 'all') return topics;
    return topics.filter((t) => t.category === category);
  };

  const resetData = () => {
    setTopics(initialTopics);
    setPrograms(initialPrograms);
    localStorage.setItem('radio_topics', JSON.stringify(initialTopics));
    localStorage.setItem('radio_programs', JSON.stringify(initialPrograms));
  };

  return (
    <RadioDataContext.Provider
      value={{
        topics,
        programs,
        addTopic,
        updateTopic,
        deleteTopic,
        getTopicById,
        addProgram,
        updateProgram,
        deleteProgram,
        getProgramsByDate,
        getProgramsByMonth,
        searchTopics,
        filterTopicsByCategory,
        resetData,
      }}
    >
      {children}
    </RadioDataContext.Provider>
  );
}

export function useRadioData() {
  const context = useContext(RadioDataContext);
  if (context === undefined) {
    throw new Error('useRadioData must be used within a RadioDataProvider');
  }
  return context;
}
