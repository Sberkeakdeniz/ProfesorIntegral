'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProfessorIcon } from './icons/ProfessorIcon';
import { Loader2, Upload, X, Sparkles } from 'lucide-react';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';

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
        setSolution('');
        
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

            const formattedSolution = data.solution
                .split('\n')
                .map((line: string) => {
                    if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
                        return line;
                    }
                    if (line.trim().startsWith('$') && line.trim().endsWith('$')) {
                        return line;
                    }

                    if (line.includes('\\begin{equation}') || line.includes('\\end{equation}') ||
                        line.includes('\\[') || line.includes('\\]')) {
                        return line;
                    }

                    const patterns = [
                        { regex: /\\frac\{[^}]*\}\{[^}]*\}/g, wrap: true },
                        { regex: /\\int[^a-zA-Z]/g, wrap: true },
                        { regex: /\\sum[^a-zA-Z]/g, wrap: true },
                        { regex: /\\prod[^a-zA-Z]/g, wrap: true },
                        { regex: /\\lim[^a-zA-Z]/g, wrap: true },
                        { regex: /\\sqrt\{[^}]*\}/g, wrap: true },
                        { regex: /[_^]\{[^}]*\}/g, wrap: true },
                        { regex: /\\[a-zA-Z]+/g, wrap: true },
                    ];

                    let newLine = line;
                    let matches: { index: number, length: number, needsWrapping: boolean }[] = [];

                    patterns.forEach(pattern => {
                        let match;
                        while ((match = pattern.regex.exec(newLine)) !== null) {
                            if (pattern.wrap) {
                                matches.push({
                                    index: match.index,
                                    length: match[0].length,
                                    needsWrapping: true
                                });
                            }
                        }
                    });

                    matches.sort((a, b) => b.index - a.index);

                    matches.forEach(match => {
                        if (match.needsWrapping) {
                            const before = newLine.slice(0, match.index);
                            const matchText = newLine.slice(match.index, match.index + match.length);
                            const after = newLine.slice(match.index + match.length);

                            if (!before.endsWith('$') && !after.startsWith('$')) {
                                newLine = `${before}$${matchText}$${after}`;
                            }
                        }
                    });

                    if (matches.length > 0 && (
                        line.includes('\\frac') || 
                        line.includes('\\int') || 
                        line.includes('\\sum') ||
                        line.includes('\\prod')
                    )) {
                        if (!newLine.startsWith('$$')) {
                            newLine = `$$${newLine.replace(/\$/g, '')}$$`;
                        }
                    }

                    return newLine;
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
        <>
            <Header />
            <main className="min-h-screen pt-16 pb-8 bg-gradient-to-b from-background via-background/95 to-background/90">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center space-y-4"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-1/2" />
                                <ProfessorIcon className="w-24 h-24 relative" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </motion.div>
                            </div>
                            <div className="relative">
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/75 bg-clip-text text-transparent pb-2">
                                    Professor Integral
                                </h1>
                                <p className="text-lg text-muted-foreground mt-2">
                                    Your AI-powered calculus companion for step-by-step solutions
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Input Section */}
                            <Card className="backdrop-blur-sm bg-card/50 border-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                                <CardHeader className="relative">
                                    <CardTitle className="text-2xl">Your Question</CardTitle>
                                    <CardDescription className="text-base">Enter your calculus problem or upload an image</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 relative">
                                    <Textarea
                                        ref={textAreaRef}
                                        placeholder="Enter your calculus problem or question here..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onPaste={handlePaste}
                                        className="min-h-[120px] transition-all duration-200 focus:border-primary resize-none text-base p-4 bg-background/80"
                                    />

                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
                                            isDragActive 
                                                ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' 
                                                : 'border-muted hover:border-primary/50 hover:bg-accent/50'
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <AnimatePresence mode="wait">
                                            {imagePreview ? (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={imagePreview}
                                                        alt="Problem"
                                                        className="max-h-[200px] mx-auto rounded-lg shadow-lg"
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeImage();
                                                        }}
                                                        className="absolute top-2 right-2 p-2.5 bg-background/90 rounded-full hover:bg-background hover:text-destructive transition-colors duration-200 shadow-md"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-center p-4"
                                                >
                                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                    <p className="text-base text-muted-foreground font-medium">
                                                        Drag & drop an image here, or click to select
                                                    </p>
                                                    <p className="text-sm text-muted-foreground/80 mt-2">
                                                        You can also paste an image directly
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <Button 
                                        onClick={solveProblem}
                                        disabled={loading || (!prompt.trim() && !image)}
                                        className="w-full relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <div className="relative flex items-center justify-center w-full">
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center justify-center text-base relative z-10"
                                                >
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Solving...
                                                </motion.div>
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                />
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                                                    initial={{ width: "0%", x: "-100%" }}
                                                    animate={{ width: "40%", x: "250%" }}
                                                    transition={{ 
                                                        duration: 1.5, 
                                                        repeat: Infinity, 
                                                        ease: "linear",
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-base font-medium">Solve Problem</span>
                                                <motion.div
                                                    className="absolute inset-0 bg-white/10"
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Solution Section */}
                            <Card className="backdrop-blur-sm bg-card/50 border-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 via-transparent to-transparent" />
                                <CardHeader className="relative">
                                    <CardTitle className="text-2xl">Solution</CardTitle>
                                    <CardDescription className="text-base">Step-by-step explanation of your problem</CardDescription>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="min-h-[400px] bg-background/80 rounded-lg p-8 overflow-auto shadow-inner">
                                        <AnimatePresence mode="wait">
                                            {error ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-destructive flex items-center gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20"
                                                >
                                                    <X className="h-5 w-5" />
                                                    <p className="text-base">{error}</p>
                                                </motion.div>
                                            ) : solution ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="prose prose-sm dark:prose-invert max-w-none"
                                                >
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkMath]}
                                                        rehypePlugins={[rehypeKatex]}
                                                        components={{
                                                            p: ({ children }) => <p className="my-3 text-base">{children}</p>,
                                                            div: ({ children }) => <div className="my-4">{children}</div>
                                                        }}
                                                    >
                                                        {solution}
                                                    </ReactMarkdown>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="h-full flex flex-col items-center justify-center text-muted-foreground p-8"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                                                        <ProfessorIcon className="w-10 h-10 text-primary/40" />
                                                    </div>
                                                    <p className="text-base text-center">
                                                        Enter your calculus problem to see the step-by-step solution
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
} 