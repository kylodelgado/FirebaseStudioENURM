// src/app/(admin)/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { listExamFiles, getExamFileContent, saveExamFileContent, deleteExamFile, type ExamFile } from '@/services/storageService';
import { FileText, Edit3, Trash2, PlusCircle, RefreshCw, UploadCloud, List } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const [examFiles, setExamFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [examContent, setExamContent] = useState<string>('');
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const { toast } = useToast();

  const fetchExamFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    try {
      const files = await listExamFiles();
      setExamFiles(files);
    } catch (error: any) {
      toast({ title: "Error Listing Exams", description: error.message, variant: "destructive" });
      setExamFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExamFiles();
  }, [fetchExamFiles]);

  const handleFileSelect = async (fileName: string) => {
    setSelectedFile(fileName);
    setIsLoadingContent(true);
    setExamContent('');
    try {
      const content = await getExamFileContent(fileName);
      setExamContent(JSON.stringify(content, null, 2));
    } catch (error: any) {
      toast({ title: "Error Loading Exam Content", description: error.message, variant: "destructive" });
      setSelectedFile(null); // Deselect if loading fails
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleSaveContent = async () => {
    if (!selectedFile || !examContent) {
      toast({ title: "Cannot Save", description: "No file selected or content is empty.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const parsedContent: ExamFile = JSON.parse(examContent); // Validate JSON before saving
      await saveExamFileContent(selectedFile, parsedContent);
      toast({ title: "Exam Saved", description: `${selectedFile} has been updated successfully.` });
    } catch (error: any) {
      toast({ title: "Error Saving Exam", description: `Failed to save ${selectedFile}: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCreateNewFile = () => {
    if (!newFileName.trim()) {
      toast({ title: "Invalid File Name", description: "File name cannot be empty.", variant: "destructive" });
      return;
    }
    const fileName = newFileName.trim().endsWith('.json') ? newFileName.trim() : `${newFileName.trim()}.json`;
    if (examFiles.includes(fileName)) {
      toast({ title: "File Exists", description: `File "${fileName}" already exists. Choose a different name or edit the existing file.`, variant: "destructive" });
      return;
    }

    const defaultExamStructure: ExamFile = {
      year: new Date().getFullYear(),
      questions: [{
        question_number: 1,
        question_text: "Sample question text...",
        correct_answer: "A",
        incorrect_answers: ["B", "C", "D"],
        Source: ["Sample Source"],
        explanation: {
          correcto: "This is the correct explanation.",
          incorrectas: [{ opcion: "B", razon: "Incorrect because..." }]
        }
      }]
    };
    
    setSelectedFile(fileName);
    setExamContent(JSON.stringify(defaultExamStructure, null, 2));
    setExamFiles(prev => [...prev, fileName].sort()); // Add to list and sort
    setNewFileName(''); // Clear input
    toast({ title: "New Exam Initialized", description: `Editing new file: ${fileName}. Don't forget to save!` });
  };

  const handleDeleteFile = async (fileName: string) => {
    setIsDeleting(true);
    try {
      await deleteExamFile(fileName);
      toast({ title: "Exam Deleted", description: `${fileName} has been deleted.` });
      setExamFiles(prevFiles => prevFiles.filter(f => f !== fileName));
      if (selectedFile === fileName) {
        setSelectedFile(null);
        setExamContent('');
      }
    } catch (error: any) {
      toast({ title: "Error Deleting Exam", description: `Failed to delete ${fileName}: ${error.message}`, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Edit3 className="mr-3 h-8 w-8 text-accent" /> Admin - Exam Management
          </h1>
          <p className="text-muted-foreground">Manage exam JSON files stored in Firebase Storage.</p>
        </div>
        <Button onClick={fetchExamFiles} variant="outline" disabled={isLoadingFiles}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingFiles ? 'animate-spin' : ''}`} /> Refresh List
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Files List Card */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center"><List className="mr-2 h-5 w-5"/> Exam Files</CardTitle>
            <CardDescription>Select an exam file to view or edit its content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
            {isLoadingFiles ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full mb-2" />)
            ) : examFiles.length > 0 ? (
              examFiles.map(file => (
                <div key={file} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left truncate ${selectedFile === file ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                    onClick={() => handleFileSelect(file)}
                    title={file}
                  >
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{file}</span>
                  </Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 flex-shrink-0" title={`Delete ${file}`} disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {file}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the exam file from storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteFile(file)} className="bg-destructive hover:bg-destructive/90">
                          {isDeleting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />} Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No exam files found in the 'exams/' folder or failed to load. Make sure files exist and check console for errors.</p>
            )}
          </CardContent>
           <CardFooter className="border-t pt-4 mt-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="new-file-name">Create New Exam File</Label>
              <div className="flex gap-2">
                <Input 
                  id="new-file-name"
                  placeholder="e.g., exam_2024_v1.json" 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleCreateNewFile} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create
                </Button>
              </div>
               <p className="text-xs text-muted-foreground">Enter a name (e.g., my_exam.json). It will be created in the 'exams/' folder.</p>
            </div>
          </CardFooter>
        </Card>

        {/* Editor Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit3 className="mr-2 h-5 w-5"/> Edit Exam: {selectedFile ? <span className="text-accent ml-1">{selectedFile}</span> : "No file selected"}
            </CardTitle>
            <CardDescription>
              {selectedFile ? "Modify the JSON content below. Ensure the structure is valid." : "Select a file from the list to edit its content here."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingContent ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : selectedFile ? (
              <Textarea
                value={examContent}
                onChange={(e) => setExamContent(e.target.value)}
                placeholder="JSON content of the exam will appear here..."
                className="min-h-[60vh] font-mono text-xs"
                spellCheck="false"
              />
            ) : (
              <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                <p>Select an exam file or create a new one to start editing.</p>
              </div>
            )}
          </CardContent>
          {selectedFile && (
            <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveContent} disabled={isSaving || isLoadingContent || !examContent} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                <UploadCloud className="mr-2 h-4 w-4" /> Save Changes to {selectedFile}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
