from django.db import models
import uuid


class Batch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    year = models.CharField(max_length=9)
    department = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.year})"


class Curriculum(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='curricula', null=True, blank=True)
    file_name = models.CharField(max_length=500)
    file_size = models.BigIntegerField(default=0)
    file_path = models.CharField(max_length=1000)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    weeks_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.file_name


class Analysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE, related_name='analyses')
    overall_score = models.IntegerField(default=0)
    confidence_score = models.IntegerField(default=0)
    report_status = models.CharField(max_length=50, default='pending')
    detected_topic = models.CharField(max_length=500, blank=True, default='')
    subtopics = models.JSONField(default=list, blank=True)
    whats_good = models.JSONField(default=list, blank=True)
    needs_improvement = models.JSONField(default=list, blank=True)
    ai_suggestions = models.JSONField(default=list, blank=True)
    quick_fixes = models.JSONField(default=list, blank=True)
    category_scores = models.JSONField(default=dict, blank=True)
    score_trend = models.JSONField(default=list, blank=True)
    improvement_summary = models.JSONField(default=dict, blank=True)
    previous_score = models.IntegerField(default=0)
    performance_change = models.FloatField(default=0.0)
    categories_improved = models.IntegerField(default=0)
    categories_total = models.IntegerField(default=0)
    full_report = models.JSONField(default=dict, blank=True)
    analyzed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-analyzed_at']

    def __str__(self):
        return f"Analysis for {self.curriculum.file_name} - Score: {self.overall_score}"
