import { useState } from 'react';
import UploadPage from './pages/UploadPage';
import ReportPage from './pages/ReportPage';
import ComparisonPage from './pages/ComparisonPage';

function App() {
    const [currentPage, setCurrentPage] = useState('upload');
    const [analysis, setAnalysis] = useState(null);
    const [curriculum, setCurriculum] = useState(null);

    const handleAnalysisComplete = (analysisData, curriculumData) => {
        setAnalysis(analysisData);
        setCurriculum(curriculumData);
        setCurrentPage('report');
    };

    const handleBackToUpload = () => {
        setAnalysis(null);
        setCurriculum(null);
        setCurrentPage('upload');
    };

    const handleNavigateToComparison = () => {
        setCurrentPage('comparison');
    };

    const handleBackToReport = () => {
        setCurrentPage('report');
    };

    switch (currentPage) {
        case 'upload':
            return <UploadPage onAnalysisComplete={handleAnalysisComplete} />;
        case 'report':
            return (
                <ReportPage
                    analysis={analysis}
                    curriculum={curriculum}
                    onBack={handleBackToUpload}
                    onNavigateToComparison={handleNavigateToComparison}
                />
            );
        case 'comparison':
            return (
                <ComparisonPage
                    analysis={analysis}
                    onBack={handleBackToReport}
                />
            );
        default:
            return <UploadPage onAnalysisComplete={handleAnalysisComplete} />;
    }
}

export default App;
