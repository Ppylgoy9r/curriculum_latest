from django.urls import path
from . import views

urlpatterns = [
    path('batches/', views.BatchListCreateView.as_view(), name='batch-list-create'),
    path('batches/<uuid:pk>/', views.BatchDetailView.as_view(), name='batch-detail'),
    path('upload/', views.CurriculumUploadView.as_view(), name='curriculum-upload'),
    path('curricula/', views.CurriculumListView.as_view(), name='curriculum-list'),
    path('benchmarks/', views.StreamBenchmarkListView.as_view(), name='benchmark-list'),
    path('analyze/<uuid:curriculum_id>/', views.AnalyzeCurriculumView.as_view(), name='analyze-curriculum'),
    path('analysis/<uuid:analysis_id>/', views.AnalysisDetailView.as_view(), name='analysis-detail'),
    path('analysis/', views.AnalysisListView.as_view(), name='analysis-list'),
    path('download/<uuid:analysis_id>/', views.DownloadAnalysisView.as_view(), name='download-analysis'),
    path('download-improvements/<uuid:analysis_id>/', views.DownloadImprovementPlanView.as_view(), name='download-improvements'),
    path('download-comparison/<uuid:analysis_id>/', views.DownloadComparisonView.as_view(), name='download-comparison'),
]
