import uuid
from django.db import migrations, models


SOURCE_URLS = {
    'Java': [
        'https://docs.oracle.com/en/java/javase/21/',
        'https://docs.spring.io/spring-boot/index.html',
        'https://docs.spring.io/spring-security/reference/index.html',
    ],
    'Python': [
        'https://docs.python.org/3/',
        'https://fastapi.tiangolo.com/',
        'https://www.djangoproject.com/start/',
    ],
    'Data Science': [
        'https://pandas.pydata.org/docs/',
        'https://scikit-learn.org/stable/',
        'https://docs.pytorch.org/docs/stable/index.html',
        'https://www.mlflow.org/docs/latest/',
    ],
    'Mechanical': [
        'https://www.autodesk.com/products/autocad/overview.htm?tab=subscription',
        'https://www.siemens.com/en-us/support/documentation-downloads/',
        'https://press.siemens.com/global/en/pressrelease/siemens-extends-digital-enterprise-offering-future-technologies-industrie-40',
    ],
}


def add_live_cache_fields(apps, schema_editor):
    StreamBenchmark = apps.get_model('curriculum_analyzer', 'StreamBenchmark')
    for benchmark in StreamBenchmark.objects.all():
        benchmark.source_urls = SOURCE_URLS.get(benchmark.stream_name, [])
        benchmark.source_status = 'seeded'
        benchmark.save(update_fields=['source_urls', 'source_status'])


def noop_reverse(apps, schema_editor):
    return


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum_analyzer', '0002_streambenchmark'),
    ]

    operations = [
        migrations.AddField(
            model_name='streambenchmark',
            name='expires_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='streambenchmark',
            name='fetched_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='streambenchmark',
            name='source_snapshot',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='streambenchmark',
            name='source_status',
            field=models.CharField(default='seeded', max_length=100),
        ),
        migrations.AddField(
            model_name='streambenchmark',
            name='source_urls',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.RunPython(add_live_cache_fields, noop_reverse),
    ]
