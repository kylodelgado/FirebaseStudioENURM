// src/services/storageService.ts
"use client"; // This service will be used client-side

import { storage } from "@/lib/firebase";
import { ref, listAll, getDownloadURL, uploadString, deleteObject } from "firebase/storage";

const EXAMS_FOLDER_PATH = "exams";

export interface ExamQuestion {
  question_number: number;
  question_text: string;
  correct_answer: string;
  incorrect_answers: string[];
  Source: string[]; // Note: JSON has "Source", TS typically uses "source"
  explanation?: {
    correcto: string;
    incorrectas: {
      opcion: string;
      razon: string;
    }[];
  };
  clue?: string;
  category?: string;
}

export interface ExamFile {
  language?: string;
  status?: string;
  year: number;
  test_type?: string;
  questions: ExamQuestion[];
}

/**
 * Lists all exam files in the "exams/" folder in Firebase Storage.
 * @returns A promise that resolves to an array of exam file names.
 */
export async function listExamFiles(): Promise<string[]> {
  const examsFolderRef = ref(storage, EXAMS_FOLDER_PATH);
  try {
    const result = await listAll(examsFolderRef);
    return result.items.map((itemRef) => itemRef.name);
  } catch (error) {
    console.error("Error listing exam files:", error);
    throw new Error("Failed to list exam files.");
  }
}

/**
 * Fetches the content of a specific exam JSON file.
 * @param fileName The name of the exam file (e.g., "exam1.json").
 * @returns A promise that resolves to the parsed JSON content of the exam file.
 */
export async function getExamFileContent(fileName: string): Promise<ExamFile> {
  const fileRef = ref(storage, `${EXAMS_FOLDER_PATH}/${fileName}`);
  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    const examData = await response.json();
    return examData as ExamFile;
  } catch (error) {
    console.error(`Error fetching exam file content for ${fileName}:`, error);
    throw new Error(`Failed to fetch content for ${fileName}.`);
  }
}

/**
 * Saves or updates an exam file in Firebase Storage.
 * @param fileName The name of the exam file to save/update.
 * @param content The exam data (as an ExamFile object) to be saved.
 * @returns A promise that resolves when the file is successfully uploaded.
 */
export async function saveExamFileContent(fileName: string, content: ExamFile): Promise<void> {
  const fileRef = ref(storage, `${EXAMS_FOLDER_PATH}/${fileName}`);
  try {
    const jsonString = JSON.stringify(content, null, 2); // Pretty print JSON
    await uploadString(fileRef, jsonString, 'raw', { contentType: 'application/json' });
  } catch (error) {
    console.error(`Error saving exam file ${fileName}:`, error);
    throw new Error(`Failed to save ${fileName}.`);
  }
}

/**
 * Deletes an exam file from Firebase Storage.
 * @param fileName The name of the exam file to delete.
 * @returns A promise that resolves when the file is successfully deleted.
 */
export async function deleteExamFile(fileName: string): Promise<void> {
  const fileRef = ref(storage, `${EXAMS_FOLDER_PATH}/${fileName}`);
  try {
    await deleteObject(fileRef);
  } catch (error) {
    console.error(`Error deleting exam file ${fileName}:`, error);
    throw new Error(`Failed to delete ${fileName}. Make sure your Storage security rules allow delete operations for admins.`);
  }
}
