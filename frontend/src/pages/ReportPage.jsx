import { useState } from 'react';
import {
    ArrowLeft, Download, CheckCircle, AlertTriangle, AlertCircle,
    TrendingUp, Eye, Sparkles, BarChart3, FileText, Target,
    BookOpen, Clock, FileSpreadsheet, Shield
} from 'lucide-react';

export default function ReportPage({ analysis, curriculum, onBack, onNavigateToComparison }) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!analysis) return null;

    const openDownload = (path) => {
        window.location.href = `${window.location.origin}${path}`;
    };

    const {
        overall_score = 0,
        confidence_score = 0,
        report_status = 'Pending',
        detected_topic = '',
        subtopics = [],
        whats_good = [],
        needs_improvement = [],
        ai_suggestions = [],
        quick_fixes = [],
        category_scores = {},
        score_trend = [],
        improvement_summary = {},
        full_report = {},
        analyzed_at = '',
    } = analysis;

    const reportSummary = full_report?.report_summary || {};
    const benchmarkComparison = full_report?.benchmark_comparison || {};

    const scoreColor = overall_score >= 75 ? '#10B981' : overall_score >= 50 ? '#F59E0B' : '#EF4444';
    const statusColor = report_status === 'Good' ? '#10B981' : report_status === 'Fair' ? '#F59E0B' : '#EF4444';

    const priorityColors = {
        High: { bg: '#FEF2F2', text: '#DC2626' },
        Medium: { bg: '#FFF7ED', text: '#EA580C' },
        Low: { bg: '#FEFCE8', text: '#CA8A04' },
    };

    const quickFixIcons = {
        chart: <BarChart3 size={20} />,
        table: <FileSpreadsheet size={20} />,
        document: <FileText size={20} />,
        target: <Target size={20} />,
    };

    const quickFixColors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B'];

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button style={styles.backButton} onClick={onBack}>
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={styles.headerTitle}>Analysis Report</h1>
                        <p style={styles.headerSubtitle}>
                            {curriculum?.file_name || 'Curriculum'} &bull; {analyzed_at ? new Date(analyzed_at).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
                <div style={styles.headerActions}>
                    <button
                        style={styles.comparisonButton}
                        onClick={onNavigateToComparison}
                    >
                        <TrendingUp size={16} />
                        Compare
                    </button>
                </div>
            </div>

            {/* Success Banner */}
            <div style={styles.successBanner}>
                <div style={styles.successIcon}>
                    <CheckCircle size={20} color="#10B981" />
                </div>
                <div style={styles.successText}>
                    <span style={styles.successTitle}>File Analyzed Successfully</span>
                    <span style={styles.successSubtitle}>
                        {detected_topic} &bull; Score: {overall_score}/100 &bull; Status: {report_status}
                    </span>
                </div>
                <button style={styles.changeFileBtn} onClick={onBack}>
                    <FileText size={14} />
                    Change File
                </button>
            </div>

            {/* Progress Steps */}
            <div style={styles.progressSteps}>
                {['Upload File', 'Generate Report', 'Get Suggestions'].map((step, i) => (
                    <div key={step} style={styles.progressStep}>
                        <div style={{
                            ...styles.stepCircle,
                            backgroundColor: '#2563EB',
                        }}>
                            {i + 1}
                        </div>
                        <span style={styles.stepLabel}>{step}</span>
                        <span style={styles.stepStatus}>Completed</span>
                        {i < 2 && <div style={styles.stepConnector}></div>}
                    </div>
                ))}
            </div>

            {/* Key Metrics Cards */}
            <div style={styles.metricsRow}>
                {/* Overall Score */}
                <div style={styles.metricCard}>
                    <div style={styles.scoreRingContainer}>
                        <svg width="90" height="90" viewBox="0 0 90 90">
                            <circle cx="45" cy="45" r="38" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                            <circle
                                cx="45" cy="45" r="38" fill="none"
                                stroke={scoreColor} strokeWidth="6"
                                strokeDasharray={`${(overall_score / 100) * 238.76} 238.76`}
                                strokeLinecap="round"
                                transform="rotate(-90 45 45)"
                            />
                            <text x="45" y="42" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1F2937">{overall_score}</text>
                            <text x="45" y="56" textAnchor="middle" fontSize="10" fill="#6B7280">/100</text>
                        </svg>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={styles.metricLabel}>Overall Score</p>
                        <span style={{
                            ...styles.statusBadge,
                            backgroundColor: statusColor + '15',
                            color: statusColor,
                        }}>{report_status}</span>
                    </div>
                </div>

                {/* Report Status */}
                <div style={styles.metricCard}>
                    <div style={{
                        ...styles.statusIconLarge,
                        backgroundColor: statusColor + '15',
                    }}>
                        {report_status === 'Good' ? <CheckCircle size={28} color={statusColor} /> :
                         <AlertTriangle size={28} color={statusColor} />}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={styles.metricLabel}>Report Status</p>
                        <p style={styles.metricDescription}>
                            {whats_good.length > 3 ? 'The report is well-structured with areas for improvement.' :
                             'The curriculum needs significant improvements.'}
                        </p>
                    </div>
                </div>

                {/* Confidence Score */}
                <div style={styles.metricCard}>
                    <div style={styles.confidenceValue}>{confidence_score}%</div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={styles.metricLabel}>Confidence Score</p>
                        <p style={styles.metricDescription}>High confidence in topic detection and analysis.</p>
                    </div>
                </div>

                {/* Detected Topic */}
                <div style={{ ...styles.metricCard, minWidth: 220 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 8 }}>{detected_topic}</p>
                    <p style={{ ...styles.metricLabel, marginBottom: 8 }}>Detected Topic</p>
                    <div style={styles.tagContainer}>
                        {subtopics.slice(0, 5).map((topic, i) => (
                            <span key={i} style={styles.tag}>{topic}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benchmark Comparison */}
            {benchmarkComparison.benchmark_found && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        <Target size={18} style={{ marginRight: 8, color: '#2563EB' }} />
                        Stream Benchmark Comparison
                    </h3>
                    <div style={styles.twoColumnRow}>
                        <div style={styles.summaryCard}>
                            <p style={styles.metricLabel}>Benchmark Used</p>
                            <h4 style={styles.suggestionTitle}>
                                {benchmarkComparison.stream_name} ({benchmarkComparison.updated_year})
                            </h4>
                            <p style={styles.metricDescription}>
                                Match: {benchmarkComparison.match_percentage}% of benchmark topics, tools, and skills found in uploaded curriculum.
                            </p>
                            <p style={styles.metricDescription}>
                                Source: {benchmarkComparison.source_status || 'cached'}{benchmarkComparison.fetched_at ? ` • refreshed ${new Date(benchmarkComparison.fetched_at).toLocaleString()}` : ''}
                            </p>
                            <div style={styles.tagContainer}>
                                {(benchmarkComparison.matched_topics || []).slice(0, 8).map((topic, i) => (
                                    <span key={i} style={styles.tag}>{topic}</span>
                                ))}
                            </div>
                        </div>
                        <div style={styles.summaryCard}>
                            <p style={styles.metricLabel}>Missing Benchmark Items</p>
                            <div style={styles.cardBody}>
                                {(benchmarkComparison.missing_topics || []).slice(0, 6).map((topic, i) => (
                                    <div key={i} style={styles.listItem}>
                                        <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <span style={styles.listText}>{topic}</span>
                                    </div>
                                ))}
                                {(benchmarkComparison.missing_tools || []).slice(0, 4).map((tool, i) => (
                                    <div key={`tool-${i}`} style={styles.listItem}>
                                        <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <span style={styles.listText}>{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* What's Good & Needs Improvement */}
            <div style={styles.twoColumnRow}>
                {/* What's Good */}
                <div style={styles.analysisCard}>
                    <div style={styles.cardHeader}>
                        <div style={{ ...styles.cardHeaderIcon, backgroundColor: '#ECFDF5' }}>
                            <CheckCircle size={18} color="#10B981" />
                        </div>
                        <h3 style={styles.cardTitle}>What's Good</h3>
                    </div>
                    <div style={styles.cardBody}>
                        {whats_good.map((item, i) => (
                            <div key={i} style={styles.listItem}>
                                <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={styles.listText}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Needs Improvement */}
                <div style={styles.analysisCard}>
                    <div style={styles.cardHeader}>
                        <div style={{ ...styles.cardHeaderIcon, backgroundColor: '#FFF7ED' }}>
                            <AlertTriangle size={18} color="#F59E0B" />
                        </div>
                        <h3 style={styles.cardTitle}>Needs Improvement</h3>
                    </div>
                    <div style={styles.cardBody}>
                        {needs_improvement.map((item, i) => (
                            <div key={i} style={styles.listItem}>
                                <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={styles.listText}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Suggestions */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                    <Sparkles size={18} style={{ marginRight: 8, color: '#2563EB' }} />
                    AI Suggestions (Actionable Improvements)
                </h3>
                <div style={styles.suggestionsGrid}>
                    {ai_suggestions.map((sug, i) => (
                        <div key={i} style={styles.suggestionCard}>
                            <div style={styles.suggestionHeader}>
                                <div style={{
                                    ...styles.suggestionIcon,
                                    backgroundColor: i === 0 ? '#EFF6FF' : i === 1 ? '#F5F3FF' : '#ECFDF5',
                                    color: i === 0 ? '#2563EB' : i === 1 ? '#7C3AED' : '#10B981',
                                }}>
                                    {i === 0 ? <BarChart3 size={20} /> : i === 1 ? <Eye size={20} /> : <Sparkles size={20} />}
                                </div>
                                <span style={{
                                    ...styles.priorityBadge,
                                    backgroundColor: (priorityColors[sug.priority] || priorityColors.Medium).bg,
                                    color: (priorityColors[sug.priority] || priorityColors.Medium).text,
                                }}>
                                    {sug.priority} Priority
                                </span>
                            </div>
                            <h4 style={styles.suggestionTitle}>{sug.title}</h4>
                            <p style={styles.suggestionDescription}>{sug.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Fix Suggestions */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                    <Target size={18} style={{ marginRight: 8, color: '#2563EB' }} />
                    Quick Fix Suggestions
                </h3>
                <div style={styles.quickFixGrid}>
                    {quick_fixes.map((fix, i) => (
                        <div key={i} style={styles.quickFixCard}>
                            <div style={{
                                ...styles.quickFixIcon,
                                backgroundColor: quickFixColors[i % quickFixColors.length] + '15',
                                color: quickFixColors[i % quickFixColors.length],
                            }}>
                                {quickFixIcons[fix.icon] || <FileText size={20} />}
                            </div>
                            <h4 style={styles.quickFixTitle}>{fix.title}</h4>
                            <p style={styles.quickFixDescription}>{fix.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Report Summary */}
            <div style={styles.section}>
                <div style={styles.twoColumnRow}>
                    <div style={styles.summaryCard}>
                        <h3 style={styles.sectionTitle}>
                            <BookOpen size={18} style={{ marginRight: 8, color: '#2563EB' }} />
                            Report Summary
                        </h3>
                        <div style={styles.summaryItems}>
                            <div style={styles.summaryItem}>
                                <FileText size={16} color="#6B7280" />
                                <span>Total Weeks: {reportSummary.total_weeks || Object.keys(category_scores).length || 'N/A'}</span>
                            </div>
                            <div style={styles.summaryItem}>
                                <BookOpen size={16} color="#6B7280" />
                                <span>Total Topics: {reportSummary.total_topics || whats_good.length + needs_improvement.length}</span>
                            </div>
                            <div style={styles.summaryItem}>
                                <Clock size={16} color="#6B7280" />
                                <span>Generated: {analyzed_at ? new Date(analyzed_at).toLocaleString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div style={styles.summaryCard}>
                        <h3 style={styles.sectionTitle}>
                            <TrendingUp size={18} style={{ marginRight: 8, color: '#10B981' }} />
                            Key Insight
                        </h3>
                        <div style={{
                            ...styles.insightBox,
                            backgroundColor: '#EFF6FF',
                            borderColor: '#BFDBFE',
                        }}>
                            <Eye size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={styles.insightText}>
                                {improvement_summary?.key_insight || 'The curriculum has been analyzed. Review the suggestions above for actionable improvements.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
                <button style={styles.outlineButton} onClick={() => openDownload(`/api/download/${analysis.id}/`)}>
                    <Download size={16} />
                    Download XLS
                </button>
                <button style={styles.outlineButton} onClick={onNavigateToComparison}>
                    <TrendingUp size={16} />
                    View Comparison
                </button>
                <button style={styles.primaryButton} onClick={() => openDownload(`/api/download-improvements/${analysis.id}/`)}>
                    <Sparkles size={16} />
                    Download AI Improvement Plan
                </button>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <Shield size={14} color="#9CA3AF" />
                <span>Your data is secure with us. We do not share your files with anyone.</span>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        padding: '0',
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        backgroundColor: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#374151',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        gap: 12,
    },
    comparisonButton: {
        padding: '8px 16px',
        backgroundColor: '#EFF6FF',
        color: '#2563EB',
        border: '1px solid #BFDBFE',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    successBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '24px 40px 0',
        padding: '14px 20px',
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 12,
    },
    successIcon: {
        width: 32,
        height: 32,
        borderRadius: 50,
        backgroundColor: '#DCFCE7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    successText: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    successTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#166534',
    },
    successSubtitle: {
        fontSize: 12,
        color: '#15803D',
    },
    changeFileBtn: {
        padding: '6px 14px',
        backgroundColor: 'white',
        color: '#2563EB',
        border: '1px solid #BFDBFE',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    progressSteps: {
        display: 'flex',
        justifyContent: 'center',
        gap: 0,
        padding: '24px 40px 8px',
    },
    progressStep: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    stepCircle: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        color: 'white',
        fontSize: 12,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    stepLabel: {
        fontSize: 13,
        fontWeight: 600,
        color: '#374151',
    },
    stepStatus: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: 500,
    },
    stepConnector: {
        width: 40,
        height: 2,
        backgroundColor: '#2563EB',
        margin: '0 8px',
    },
    metricsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        padding: '24px 40px',
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    scoreRingContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    metricLabel: {
        fontSize: 13,
        color: '#6B7280',
        margin: 0,
        marginBottom: 6,
    },
    statusBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
    },
    statusIconLarge: {
        width: 56,
        height: 56,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    metricDescription: {
        fontSize: 12,
        color: '#9CA3AF',
        margin: 0,
        lineHeight: 1.5,
        maxWidth: 180,
    },
    confidenceValue: {
        fontSize: 36,
        fontWeight: 800,
        color: '#2563EB',
        lineHeight: 1,
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        padding: '4px 10px',
        backgroundColor: '#EFF6FF',
        color: '#2563EB',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
    },
    twoColumnRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
    },
    analysisCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
        overflow: 'hidden',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 20px',
        borderBottom: '1px solid #F3F4F6',
    },
    cardHeaderIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
    },
    cardBody: {
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    listItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
    },
    listText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 1.5,
    },
    section: {
        padding: '0 40px',
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
    },
    suggestionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
    },
    suggestionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
    },
    suggestionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    suggestionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    priorityBadge: {
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
    },
    suggestionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#1F2937',
        margin: '0 0 8px 0',
    },
    suggestionDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 1.6,
        margin: 0,
    },
    quickFixGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
    },
    quickFixCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 10,
    },
    quickFixIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickFixTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: '#1F2937',
        margin: 0,
    },
    quickFixDescription: {
        fontSize: 11,
        color: '#9CA3AF',
        lineHeight: 1.5,
        margin: 0,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
    },
    summaryItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 12,
    },
    summaryItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 13,
        color: '#4B5563',
    },
    insightBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 10,
        border: '1px solid',
        marginTop: 12,
    },
    insightText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 1.6,
        margin: 0,
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        padding: '32px 40px 16px',
    },
    outlineButton: {
        padding: '12px 24px',
        backgroundColor: 'white',
        color: '#2563EB',
        border: '1.5px solid #BFDBFE',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    primaryButton: {
        padding: '12px 24px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '24px 40px 32px',
        fontSize: 12,
        color: '#9CA3AF',
    },
};
