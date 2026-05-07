from django.contrib import admin
from .models import Batch, Curriculum, Analysis


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ['name', 'year', 'department', 'created_at']
    search_fields = ['name', 'year', 'department']


@admin.register(Curriculum)
class CurriculumAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'file_size', 'batch', 'uploaded_at']
    search_fields = ['file_name']


@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ['curriculum', 'overall_score', 'confidence_score', 'report_status', 'analyzed_at']
    search_fields = ['detected_topic', 'report_status']
