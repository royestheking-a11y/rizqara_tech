import concepts from './selected-concepts.json';
import type { Project } from '../context/DataContext';

type Concept = Project & {
  imageAlt: string;
  challenge: string;
  workflow: { title: string; detail: string }[];
  validation: string;
};

export const selectedConcepts: Concept[] = concepts.map(concept => ({ ...concept, status: "Concept" }));
