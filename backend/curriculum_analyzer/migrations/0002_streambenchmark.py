import uuid
from django.db import migrations, models


BENCHMARKS = [
    {
        'stream_name': 'Java',
        'benchmark_topics': [
            'Core Java', 'Object-Oriented Programming', 'Collections Framework',
            'Exception Handling', 'Generics', 'Streams and Lambda Expressions',
            'Multithreading and Concurrency', 'JDBC', 'SQL', 'REST APIs',
            'Spring Boot', 'Spring Security', 'Microservices', 'Testing',
            'Design Patterns', 'Cloud Deployment'
        ],
        'required_tools': [
            'JDK 17 or 21', 'Maven or Gradle', 'Git', 'JUnit', 'Mockito',
            'Spring Boot', 'Docker', 'Jenkins or GitHub Actions',
            'PostgreSQL or MySQL', 'Postman', 'Kubernetes basics'
        ],
        'industry_skills': [
            'Backend API development', 'Secure authentication and authorization',
            'Database design', 'CI/CD', 'Containerization', 'Cloud-native deployment',
            'Code quality', 'Unit and integration testing', 'System design basics'
        ],
        'expected_outcomes': [
            'Build REST APIs with Spring Boot',
            'Design normalized relational schemas',
            'Write tested maintainable Java services',
            'Deploy containerized Java applications',
            'Implement secure API access'
        ],
        'updated_year': '2025-2026',
    },
    {
        'stream_name': 'Python',
        'benchmark_topics': [
            'Python fundamentals', 'Functions', 'Object-Oriented Programming',
            'Data structures', 'File handling', 'Exception handling',
            'Virtual environments', 'Packages and modules', 'REST APIs',
            'FastAPI or Django', 'SQL', 'Testing', 'Automation scripting',
            'Data analysis basics', 'Cloud deployment'
        ],
        'required_tools': [
            'Python 3.11+', 'pip', 'venv', 'Git', 'pytest', 'FastAPI',
            'Django', 'Pandas', 'SQLAlchemy', 'PostgreSQL', 'Docker',
            'Postman', 'GitHub Actions'
        ],
        'industry_skills': [
            'API development', 'Automation', 'Data handling', 'Testing',
            'Package management', 'Database integration', 'Cloud deployment',
            'Clean coding practices'
        ],
        'expected_outcomes': [
            'Create production-ready Python APIs',
            'Automate file and data workflows',
            'Write testable Python modules',
            'Connect applications to SQL databases',
            'Package and deploy Python services'
        ],
        'updated_year': '2025-2026',
    },
    {
        'stream_name': 'Data Science',
        'benchmark_topics': [
            'Python', 'SQL', 'Statistics', 'Probability', 'Data cleaning',
            'Exploratory data analysis', 'Data visualization', 'Machine learning',
            'Deep learning basics', 'Natural language processing',
            'Time series forecasting', 'Model evaluation', 'Feature engineering',
            'MLOps', 'Responsible AI'
        ],
        'required_tools': [
            'Python', 'Jupyter', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn',
            'Scikit-learn', 'TensorFlow or PyTorch', 'SQL', 'Power BI or Tableau',
            'MLflow', 'Docker', 'Cloud notebooks'
        ],
        'industry_skills': [
            'Business problem framing', 'Data storytelling', 'Model selection',
            'Experiment tracking', 'Bias and fairness evaluation',
            'Production model monitoring', 'Dashboarding'
        ],
        'expected_outcomes': [
            'Analyze real datasets end to end',
            'Build and evaluate ML models',
            'Communicate findings with dashboards',
            'Deploy or track models using MLOps practices',
            'Apply responsible AI checks'
        ],
        'updated_year': '2025-2026',
    },
    {
        'stream_name': 'Mechanical',
        'benchmark_topics': [
            'Engineering mechanics', 'Thermodynamics', 'Fluid mechanics',
            'Manufacturing processes', 'Machine design', 'CAD', 'CAM',
            'Finite element analysis', 'Materials science', 'Mechatronics',
            'Additive manufacturing', 'Robotics basics', 'Industry 4.0',
            'Predictive maintenance', 'Quality control'
        ],
        'required_tools': [
            'AutoCAD', 'SolidWorks or CATIA', 'ANSYS', 'MATLAB',
            'CNC/CAM software', '3D printing tools', 'PLC basics',
            'IoT sensors', 'Excel or Python for engineering analysis'
        ],
        'industry_skills': [
            'CAD modeling', 'Simulation-driven design', 'Manufacturability analysis',
            'Automation awareness', 'Lean manufacturing', 'Quality inspection',
            'Data-driven maintenance', 'Safety and standards compliance'
        ],
        'expected_outcomes': [
            'Create manufacturable CAD models',
            'Run basic simulation and interpret results',
            'Select materials and manufacturing processes',
            'Understand smart manufacturing workflows',
            'Prepare engineering documentation'
        ],
        'updated_year': '2025-2026',
    },
]


def seed_benchmarks(apps, schema_editor):
    StreamBenchmark = apps.get_model('curriculum_analyzer', 'StreamBenchmark')
    for benchmark in BENCHMARKS:
        StreamBenchmark.objects.update_or_create(
            stream_name=benchmark['stream_name'],
            defaults=benchmark,
        )


def remove_benchmarks(apps, schema_editor):
    StreamBenchmark = apps.get_model('curriculum_analyzer', 'StreamBenchmark')
    StreamBenchmark.objects.filter(stream_name__in=[item['stream_name'] for item in BENCHMARKS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum_analyzer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='StreamBenchmark',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('stream_name', models.CharField(max_length=255, unique=True)),
                ('benchmark_topics', models.JSONField(blank=True, default=list)),
                ('required_tools', models.JSONField(blank=True, default=list)),
                ('industry_skills', models.JSONField(blank=True, default=list)),
                ('expected_outcomes', models.JSONField(blank=True, default=list)),
                ('updated_year', models.CharField(default='2025-2026', max_length=9)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['stream_name'],
            },
        ),
        migrations.RunPython(seed_benchmarks, remove_benchmarks),
    ]
