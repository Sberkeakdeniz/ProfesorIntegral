'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ProfessorIcon } from './icons/ProfessorIcon';
import { Loader2, Upload, X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useDropzone } from 'react-dropzone';

export default function MathProblemSolver() {
    const [prompt, setPrompt] = useState('');
    const [solution, setSolution] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        handleImageSelection(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxFiles: 1,
        multiple: false
    });

    const handleImageSelection = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handleImageSelection(file);
                }
                break;
            }
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const solveProblem = async () => {
        if (!prompt.trim() && !imagePreview) return;

        setLoading(true);
        setError('');
        setSolution(''); // Clear previous solution
        
        try {
            const response = await fetch('/api/solve-math', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    imageData: imagePreview
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to solve the problem');
            }

            const data = await response.json();
            if (!data.solution) {
                throw new Error('No solution received');
            }

            // Ensure LaTeX expressions are properly wrapped in math mode
            const formattedSolution = data.solution
                .split('\n')
                .map((line: string) => {
                    // Skip lines that are already in math mode
                    if (line.trim().startsWith('$') && line.trim().endsWith('$')) {
                        return line;
                    }
                    // Convert LaTeX expressions to math mode
                    return line.replace(/\\[a-zA-Z]+{[^}]*}|\\[a-zA-Z]+\[[^]]*\]{[^}]*}/g, match => {
                        if (!match.startsWith('$')) {
                            return `$${match}$`;
                        }
                        return match;
                    });
                })
                .join('\n');

            setSolution(formattedSolution);
        } catch (error) {
            console.error('Error solving problem:', error);
            setError('Please try again with a clearer image or problem description');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <ProfessorIcon className="w-12 h-12" />
                <h2 className="text-2xl font-bold">Professor Integral</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Question</h3>
                    <div className="space-y-4">
                        <Textarea
                            ref={textAreaRef}
                            placeholder="Enter your calculus problem or question here..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onPaste={handlePaste}
                            className="min-h-[120px]"
                        />

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                                isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
                            }`}
                        >
                            <input {...getInputProps()} />
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Problem"
                                        className="max-h-[200px] mx-auto rounded-lg"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Drag & drop an image here, or click to select
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        You can also paste an image directly
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button 
                            onClick={solveProblem}
                            disabled={loading || (!prompt.trim() && !image)}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Solving...
                                </>
                            ) : (
                                'Solve Problem'
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Solution Section */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Solution</h3>
                    <div className="min-h-[200px] bg-secondary/50 rounded-lg p-4 overflow-auto">
                        {error ? (
                            <div className="text-red-500">{error}</div>
                        ) : solution ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        // Ensure inline math is properly rendered
                                        p: ({ children }) => <p className="my-2">{children}</p>,
                                        // Ensure block math is properly rendered
                                        div: ({ children }) => <div className="my-4">{children}</div>
                                    }}
                                >
                                    {solution}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm">
                                The solution will appear here...
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
} 