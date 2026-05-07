from rest_framework import serializers
from .models import Batch, Curriculum, Analysis


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['id', 'name', 'year', 'department', 'created_at', 'updated_at']


class CurriculumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curriculum
        fields = ['id', 'batch', 'file_name', 'file_size', 'file_path', 'uploaded_at', 'weeks_data']


class CurriculumUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    batch_id = serializers.UUIDField(required=False, allow_null=True)
    batch_name = serializers.CharField(required=False, allow_blank=True, default='')
    batch_year = serializers.CharField(required=False, default='2025-2026')


class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = '__all__'


class AnalysisSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = [
            'id', 'curriculum', 'overall_score', 'confidence_score', 'report_status',
            'detected_topic', 'subtopics', 'whats_good', 'needs_improvement',
            'ai_suggestions', 'quick_fixes', 'category_scores', 'score_trend',
            'improvement_summary', 'previous_score', 'performance_change',
            'categories_improved', 'categories_total', 'analyzed_at'
        ]
