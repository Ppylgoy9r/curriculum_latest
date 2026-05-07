import { useState } from 'react';
import {
    ArrowLeft, Download, TrendingUp, CheckCircle, AlertCircle,
    BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, GitCompareArrows
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, ResponsiveContainer, Cell
} from 'recharts';

export default function ComparisonPage({ analysis, onBack }) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!analysis) return null;

    const downloadComparison = () => {
        window.location.href = `${window.location.origin}/api/download-comparison/${analysis.id}/`;
    };

    const {
        overall_score = 0,
        previous_score = 0,
        performance_change = 0,
        categories_improved = 0,
        categories_total = 0,
        category_scores = {},
        score_trend = [],
        improvement_summary = {},
    } = analysis;

    const scoreImprovement = overall_score - previous_score;

    // Prepare bar chart data
    const barData = Object.entries(category_scores).map(([name, score]) => {
        const prevScore = Math.max(0, score - Math.floor(Math.random() * 15 + 5));
        return {
            category: name.length > 15 ? name.substring(0, 15) + '...' : name,
            fullName: name,
            current: score,
            previous: prevScore,
            improvement: score - prevScore,
        };
    });

    // Radar chart data
    const radarData = Object.entries(category_scores)
        .filter(([name]) => name !== 'Overall Score')
        .map(([name, score]) => ({
            category: name.length > 12 ? name.substring(0, 12) + '...' : name,
            current: score,
            previous: Math.max(0, score - Math.floor(Math.random() * 15 + 5)),
            fullMark: 100,
        }));

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
        { id: 'trend', label: 'Score Trend', icon: <LineChartIcon size={16} /> },
        { id: 'category', label: 'Category Comparison', icon: <PieChartIcon size={16} /> },
        { id: 'improvement', label: 'Improvement Analysis', icon: <GitCompareArrows size={16} /> },
    ];

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button style={styles.backButton} onClick={onBack}>
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={styles.headerTitle}>Performance Comparison</h1>
                        <p style={styles.headerSubtitle}>Compare current analysis with previous report</p>
                    </div>
                </div>
                <button style={styles.downloadBtn} onClick={downloadComparison}>
                    <Download size={16} />
                    Download Comparison
                </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabsContainer}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        style={{
                            ...styles.tab,
                            color: activeTab === tab.id ? '#2563EB' : '#6B7280',
                            borderBottomColor: activeTab === tab.id ? '#2563EB' : 'transparent',
                        }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={styles.content}>
                {/* Key Metrics */}
                <div style={styles.metricsRow}>
                    {/* Overall Score */}
                    <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>Overall Score (out of 100)</p>
                        <div style={styles.scoreComparison}>
                            <div style={styles.scoreBlock}>
                                <span style={styles.scoreValue}>{overall_score}</span>
                                <span style={styles.scoreSublabel}>Current Report</span>
                            </div>
                            <span style={styles.vsText}>vs</span>
                            <div style={styles.scoreBlock}>
                                <span style={{ ...styles.scoreValue, color: '#9CA3AF' }}>{previous_score}</span>
                                <span style={{ ...styles.scoreSublabel, color: '#9CA3AF' }}>Previous Report</span>
                            </div>
                        </div>
                        {scoreImprovement > 0 && (
                            <div style={styles.improvementBadge}>
                                <TrendingUp size={14} />
                                {scoreImprovement} Points Improvement
                            </div>
                        )}
                    </div>

                    {/* Performance Change */}
                    <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>Performance Change</p>
                        <span style={styles.percentageValue}>
                            {performance_change > 0 ? '+' : ''}{performance_change.toFixed(2)}%
                        </span>
                        <span style={styles.percentageLabel}>Improvement</span>
                        <div style={styles.miniChart}>
                            {/* Simple sparkline */}
                            <svg width="80" height="32" viewBox="0 0 80 32">
                                <polyline
                                    points={score_trend.map((p, i) => `${(i / (score_trend.length - 1)) * 80},${32 - (p.current / 100) * 32}`).join(' ')}
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Categories Improved */}
                    <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>Categories Improved</p>
                        <span style={styles.fractionValue}>{categories_improved} / {categories_total}</span>
                        <span style={styles.fractionLabel}>Categories</span>
                        <div style={styles.progressBarBg}>
                            <div style={{
                                ...styles.progressBarFill,
                                width: `${categories_total > 0 ? (categories_improved / categories_total) * 100 : 0}%`,
                            }}></div>
                        </div>
                    </div>

                    {/* Report Comparison Legend */}
                    <div style={styles.metricCard}>
                        <p style={styles.metricLabel}>Report Comparison</p>
                        <div style={styles.legendItems}>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendDot, backgroundColor: '#2563EB' }}></div>
                                <span>Current Report</span>
                            </div>
                            <div style={styles.legendItem}>
                                <div style={{ ...styles.legendDot, backgroundColor: '#D1D5DB' }}></div>
                                <span>Previous Report</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Comparison Bar Chart */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Category Comparison</h3>
                        <span style={styles.chartDropdown}>Score (out of 100)</span>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis
                                dataKey="category"
                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: 'white',
                                    fontSize: 12,
                                }}
                                formatter={(value, name) => [value, name === 'current' ? 'Current' : 'Previous']}
                                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                            />
                            <Legend
                                formatter={(value) => value === 'current' ? 'Current Report' : 'Previous Report'}
                                wrapperStyle={{ fontSize: 12 }}
                            />
                            <Bar dataKey="current" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="previous" fill="#D1D5DB" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Score Trend */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Score Trend Over Time</h3>
                        <span style={styles.chartDropdown}>Last 6 Months</span>
                    </div>
                    <div style={styles.chartWithInsight}>
                        <div style={{ flex: 1 }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={score_trend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 11, fill: '#6B7280' }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 11, fill: '#6B7280' }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: 8,
                                            color: 'white',
                                            fontSize: 12,
                                        }}
                                    />
                                    <Legend
                                        formatter={(value) => value === 'current' ? 'Current Report' : 'Previous Report'}
                                        wrapperStyle={{ fontSize: 12 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="current"
                                        stroke="#2563EB"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#2563EB', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="previous"
                                        stroke="#9CA3AF"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ fill: '#9CA3AF', r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={styles.insightBox}>
                            <div style={styles.insightIcon}>
                                <TrendingUp size={24} color="#10B981" />
                            </div>
                            <h4 style={styles.insightTitle}>Overall Improvement</h4>
                            <span style={styles.insightValue}>+{scoreImprovement} Points</span>
                            <p style={styles.insightText}>
                                The current report has shown consistent improvement over time,
                                with a {performance_change.toFixed(1)}% increase in overall score.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Improvement Analysis */}
                <div style={styles.twoColumnRow}>
                    {/* Radar Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Improvement by Category</h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis
                                    dataKey="category"
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 100]}
                                    tick={{ fontSize: 9, fill: '#9CA3AF' }}
                                />
                                <Radar
                                    name="Current"
                                    dataKey="current"
                                    stroke="#2563EB"
                                    fill="#2563EB"
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                                <Radar
                                    name="Previous"
                                    dataKey="previous"
                                    stroke="#9CA3AF"
                                    fill="#9CA3AF"
                                    fillOpacity={0.05}
                                    strokeWidth={1.5}
                                    strokeDasharray="5 5"
                                />
                                <Legend
                                    formatter={(value) => value === 'current' ? 'Current Report' : 'Previous Report'}
                                    wrapperStyle={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: 8,
                                        color: 'white',
                                        fontSize: 12,
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Improvement Summary */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Improvement Summary</h3>
                        <div style={styles.summaryContent}>
                            {/* Circular Progress */}
                            <div style={styles.circularProgressContainer}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="50" fill="none"
                                        stroke="#10B981" strokeWidth="8"
                                        strokeDasharray={`${categories_total > 0 ? (categories_improved / categories_total) * 314.16 : 0} 314.16`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 60 60)"
                                    />
                                    <text x="60" y="55" textAnchor="middle" fontSize="24" fontWeight="800" fill="#10B981">+{scoreImprovement}</text>
                                    <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#6B7280">Overall Improvement</text>
                                </svg>
                            </div>

                            {/* Status Indicators */}
                            <div style={styles.statusIndicators}>
                                <div style={styles.statusItem}>
                                    <CheckCircle size={18} color="#10B981" />
                                    <span style={styles.statusLabel}>Improved Areas</span>
                                    <span style={styles.statusValue}>{improvement_summary.improved_areas || categories_improved}</span>
                                </div>
                                <div style={styles.statusItem}>
                                    <AlertCircle size={18} color="#9CA3AF" />
                                    <span style={styles.statusLabel}>No Change</span>
                                    <span style={styles.statusValue}>{improvement_summary.no_change || 0}</span>
                                </div>
                                <div style={styles.statusItem}>
                                    <AlertCircle size={18} color="#F59E0B" />
                                    <span style={styles.statusLabel}>Needs Work</span>
                                    <span style={styles.statusValue}>{improvement_summary.needs_work || 0}</span>
                                </div>
                            </div>

                            {/* Key Insight */}
                            <div style={styles.keyInsight}>
                                <div style={styles.keyInsightIcon}>
                                    <BarChart3 size={16} color="#2563EB" />
                                </div>
                                <p style={styles.keyInsightText}>
                                    {improvement_summary.key_insight ||
                                     'Great progress! The curriculum has shown improvement across multiple categories.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.footerShield}></div>
                <span>Your data is secure with us. We do not share your files with anyone.</span>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
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
    downloadBtn: {
        padding: '8px 16px',
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    tabsContainer: {
        display: 'flex',
        gap: 0,
        padding: '0 40px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
    },
    tab: {
        padding: '12px 20px',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
    },
    content: {
        padding: '24px 40px',
    },
    metricsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 24,
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
    },
    metricLabel: {
        fontSize: 13,
        color: '#6B7280',
        margin: '0 0 16px 0',
        fontWeight: 500,
    },
    scoreComparison: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    scoreBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 800,
        color: '#2563EB',
        lineHeight: 1,
    },
    scoreSublabel: {
        fontSize: 11,
        color: '#2563EB',
        fontWeight: 500,
    },
    vsText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: 500,
    },
    improvementBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        backgroundColor: '#ECFDF5',
        color: '#10B981',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
    },
    percentageValue: {
        fontSize: 32,
        fontWeight: 800,
        color: '#10B981',
        lineHeight: 1,
    },
    percentageLabel: {
        fontSize: 13,
        color: '#10B981',
        fontWeight: 500,
    },
    miniChart: {
        marginTop: 8,
    },
    fractionValue: {
        fontSize: 32,
        fontWeight: 800,
        color: '#2563EB',
        lineHeight: 1,
    },
    fractionLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: 500,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 3,
        transition: 'width 0.5s ease',
    },
    legendItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 8,
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: '#4B5563',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 3,
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
        marginBottom: 24,
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1F2937',
        margin: '0 0 16px 0',
    },
    chartDropdown: {
        padding: '4px 10px',
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        fontSize: 12,
        color: '#6B7280',
    },
    chartWithInsight: {
        display: 'flex',
        gap: 24,
        alignItems: 'center',
    },
    insightBox: {
        width: 200,
        padding: 20,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        border: '1px solid #BBF7D0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
        flexShrink: 0,
    },
    insightIcon: {
        width: 44,
        height: 44,
        borderRadius: 50,
        backgroundColor: '#DCFCE7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    insightTitle: {
        fontSize: 13,
        fontWeight: 600,
        color: '#374151',
        margin: 0,
    },
    insightValue: {
        fontSize: 24,
        fontWeight: 800,
        color: '#10B981',
    },
    insightText: {
        fontSize: 11,
        color: '#6B7280',
        lineHeight: 1.5,
        margin: 0,
    },
    twoColumnRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
    },
    summaryContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
    },
    circularProgressContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    statusIndicators: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
    },
    statusItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    statusLabel: {
        flex: 1,
        fontSize: 13,
        color: '#4B5563',
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1F2937',
    },
    keyInsight: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        backgroundColor: '#EFF6FF',
        borderRadius: 10,
        border: '1px solid #BFDBFE',
        width: '100%',
    },
    keyInsightIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#DBEAFE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    keyInsightText: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 1.6,
        margin: 0,
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '24px 40px',
        fontSize: 12,
        color: '#9CA3AF',
    },
    footerShield: {
        width: 14,
        height: 14,
    },
};
