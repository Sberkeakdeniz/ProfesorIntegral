import MathProblemSolver from '@/components/MathProblemSolver';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SolvePage({
    searchParams
}: PageProps) {
    await searchParams; // Ensure searchParams is resolved
    return <MathProblemSolver />;
} 