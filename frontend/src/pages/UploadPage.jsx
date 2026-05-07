import { useState, useRef } from 'react';
import { uploadCurriculum, analyzeCurriculum } from '../api';
import { Paperclip, Upload as UploadIcon, Loader2, GraduationCap } from 'lucide-react';

export default function UploadPage({ onAnalysisComplete }) {
    const [file, setFile] = useState(null);
    const [batchName, setBatchName] = useState('');
    const [batchYear, setBatchYear] = useState('2025-2026');
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            const validExtensions = ['.xlsx', '.xls', '.csv', '.pdf', '.doc', '.docx'];
            const ext = '.' + selected.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(ext)) {
                setError(`Invalid file type. Supported: ${validExtensions.join(', ')}`);
                return;
            }
            if (selected.size > 52428800) {
                setError('File too large. Maximum size is 50MB.');
                return;
            }
            setFile(selected);
            setError('');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropped = e.dataTransfer.files[0];
        if (dropped) {
            setFile(dropped);
            setError('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setAnalyzing(false);
        setError('');
        setProgress(0);
        setProgressMessage('Uploading file...');

        try {
            // Step 1: Upload
            const uploadResult = await uploadCurriculum(file, batchName, batchYear);
            setProgress(33);
            setProgressMessage('File uploaded. Starting AI analysis...');

            // Step 2: Analyze
            setAnalyzing(true);
            setUploading(false);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 90) return prev + Math.random() * 5;
                    return prev;
                });
            }, 500);

            const analysisResult = await analyzeCurriculum(uploadResult.id);
            clearInterval(progressInterval);
            setProgress(100);
            setProgressMessage('Analysis complete!');

            setTimeout(() => {
                onAnalysisComplete(analysisResult, uploadResult);
            }, 500);

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Upload or analysis failed. Please try again.');
            setUploading(false);
            setAnalyzing(false);
            setProgress(0);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div style={styles.pageContainer}>
            {/* Background with diagonal split */}
            <div style={styles.blueSection}></div>
            <div style={styles.whiteSection}></div>

            {/* Decorative dots */}
            <div style={styles.dotsPattern}>
                {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} style={styles.dot}></div>
                ))}
            </div>

            {/* Decorative circle */}
            <div style={styles.decorativeCircle}></div>

            {/* Upload Card */}
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoContainer}>
                    <div style={styles.logo}>
                        <GraduationCap size={28} color="white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 style={styles.title}>Upload Curriculum</h1>
                <p style={styles.subtitle}>Upload your curriculum file for AI-powered analysis</p>

                {/* Progress Steps */}
                {(uploading || analyzing) && (
                    <div style={styles.progressContainer}>
                        <div style={styles.progressBarBg}>
                            <div style={{
                                ...styles.progressBarFill,
                                width: `${progress}%`
                            }}></div>
                        </div>
                        <p style={styles.progressText}>{progressMessage}</p>
                    </div>
                )}

                {/* File Upload Area */}
                <div
                    style={{
                        ...styles.uploadArea,
                        borderColor: file ? '#2563EB' : '#E5E7EB',
                        backgroundColor: file ? '#EFF6FF' : '#FAFAFA',
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div style={styles.uploadAreaContent}>
                        <div style={styles.uploadIcon}>
                            <Paperclip size={20} color="#9CA3AF" />
                        </div>
                        <div style={styles.uploadTextContainer}>
                            <span style={styles.uploadText}>
                                {file ? file.name : 'Choose a file to upload'}
                            </span>
                            {file && (
                                <span style={styles.fileSize}>{formatFileSize(file.size)}</span>
                            )}
                        </div>
                        <button
                            style={styles.browseButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            {uploading || analyzing ? (
                                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                'Browse'
                            )}
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                    />
                </div>

                {/* Batch Info */}
                <div style={styles.batchInfo}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Batch Name (Optional)</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="e.g., Computer Science 2025"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            disabled={uploading || analyzing}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Academic Year</label>
                        <select
                            style={styles.select}
                            value={batchYear}
                            onChange={(e) => setBatchYear(e.target.value)}
                            disabled={uploading || analyzing}
                        >
                            <option value="2025-2026">2025-2026</option>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2026-2027">2026-2027</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    style={{
                        ...styles.submitButton,
                        opacity: (uploading || analyzing) ? 0.7 : 1,
                        cursor: (uploading || analyzing) ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleSubmit}
                    disabled={uploading || analyzing}
                >
                    {(uploading || analyzing) ? (
                        <>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
                            {analyzing ? 'Analyzing Curriculum...' : 'Uploading...'}
                        </>
                    ) : (
                        <>
                            <UploadIcon size={18} style={{ marginRight: 8 }} />
                            Upload & Analyze
                        </>
                    )}
                </button>

                {/* Error */}
                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorText}>{error}</p>
                    </div>
                )}

                {/* Support Text */}
                <p style={styles.supportText}>
                    Supports: XLSX, XLS, CSV, PDF, DOC, DOCX (Max 50MB)
                </p>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    pageContainer: {
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    blueSection: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '55%',
        height: '100%',
        background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
        clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)',
        zIndex: 0,
    },
    whiteSection: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        zIndex: 0,
    },
    dotsPattern: {
        position: 'absolute',
        top: 40,
        left: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 8px)',
        gap: '12px',
        zIndex: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    decorativeCircle: {
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: 300,
        height: 300,
        borderRadius: '50%',
        backgroundColor: 'rgba(37, 99, 235, 0.06)',
        zIndex: 0,
    },
    card: {
        position: 'relative',
        zIndex: 10,
        maxWidth: 580,
        width: '90%',
        margin: '0 auto',
        padding: '48px 40px',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '90vh',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 14,
        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        margin: 0,
        marginBottom: 28,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 24,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #2563EB, #10B981)',
        borderRadius: 3,
        transition: 'width 0.3s ease',
    },
    progressText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    uploadArea: {
        width: '100%',
        border: '2px dashed',
        borderRadius: 12,
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: 20,
    },
    uploadAreaContent: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    uploadIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    uploadTextContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    uploadText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: 500,
    },
    fileSize: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    browseButton: {
        padding: '10px 24px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        transition: 'background 0.2s',
    },
    batchInfo: {
        width: '100%',
        display: 'flex',
        gap: 16,
        marginBottom: 24,
    },
    inputGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#374151',
    },
    input: {
        padding: '10px 14px',
        border: '1.5px solid #E5E7EB',
        borderRadius: 8,
        fontSize: 14,
        color: '#374151',
        outline: 'none',
        transition: 'border 0.2s',
        fontFamily: 'inherit',
    },
    select: {
        padding: '10px 14px',
        border: '1.5px solid #E5E7EB',
        borderRadius: 8,
        fontSize: 14,
        color: '#374151',
        outline: 'none',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontFamily: 'inherit',
    },
    submitButton: {
        width: '100%',
        padding: '14px 24px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.2s',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
        marginBottom: 16,
    },
    errorContainer: {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        fontSize: 13,
        color: '#DC2626',
        margin: 0,
    },
    supportText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        margin: 0,
    },
};
