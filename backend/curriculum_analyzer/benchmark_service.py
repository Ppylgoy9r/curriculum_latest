import os
import re
from datetime import timedelta

import requests
from django.utils import timezone


DEFAULT_STREAM_SOURCES = {
    'Java': [
        'https://docs.oracle.com/en/java/javase/21/',
        'https://docs.spring.io/spring-boot/index.html',
        'https://docs.spring.io/spring-security/reference/index.html',
        'https://docs.docker.com/',
        'https://kubernetes.io/docs/home/',
    ],
    'Python': [
        'https://docs.python.org/3/',
        'https://fastapi.tiangolo.com/',
        'https://www.djangoproject.com/start/',
        'https://pytest.org/en/stable/',
        'https://pandas.pydata.org/docs/',
    ],
    'Data Science': [
        'https://pandas.pydata.org/docs/',
        'https://scikit-learn.org/stable/',
        'https://docs.pytorch.org/docs/stable/index.html',
        'https://www.mlflow.org/docs/latest/',
        'https://www.tensorflow.org/',
    ],
    'Mechanical': [
        'https://www.autodesk.com/products/autocad/overview.htm?tab=subscription',
        'https://www.siemens.com/en-us/support/documentation-downloads/',
        'https://press.siemens.com/global/en/pressrelease/siemens-extends-digital-enterprise-offering-future-technologies-industrie-40',
        'https://help.solidworks.com/',
        'https://www.ansys.com/',
    ],
}

DEFAULT_REFRESH_HOURS = int(os.environ.get('BENCHMARK_REFRESH_HOURS', '168'))


def refresh_live_benchmark(benchmark, force=False):
    """Refresh benchmark data from live web sources and cache the result."""
    if benchmark is None:
        return None

    source_urls = DEFAULT_STREAM_SOURCES.get(benchmark.stream_name) or benchmark.source_urls or []
    if not source_urls:
        return benchmark

    if not force and benchmark.expires_at and benchmark.expires_at > timezone.now() and benchmark.benchmark_topics:
        return benchmark

    snapshots = fetch_source_snapshots(source_urls)
    benchmark.source_urls = source_urls
    benchmark.source_snapshot = snapshots
    benchmark.source_status = 'fetched'

    try:
        payload = generate_benchmark_from_snapshots(benchmark.stream_name, snapshots, benchmark.updated_year)
        benchmark.benchmark_topics = payload.get('benchmark_topics', benchmark.benchmark_topics)
        benchmark.required_tools = payload.get('required_tools', benchmark.required_tools)
        benchmark.industry_skills = payload.get('industry_skills', benchmark.industry_skills)
        benchmark.expected_outcomes = payload.get('expected_outcomes', benchmark.expected_outcomes)
        benchmark.updated_year = payload.get('updated_year', benchmark.updated_year)
        benchmark.source_status = 'refreshed'
    except Exception as exc:
        benchmark.source_status = f'cached-fallback: {exc}'

    now = timezone.now()
    benchmark.fetched_at = now
    benchmark.expires_at = now + timedelta(hours=DEFAULT_REFRESH_HOURS)
    benchmark.save(update_fields=[
        'benchmark_topics', 'required_tools', 'industry_skills', 'expected_outcomes',
        'updated_year', 'source_urls', 'source_snapshot', 'source_status',
        'fetched_at', 'expires_at', 'updated_at'
    ])
    return benchmark


def fetch_source_snapshots(source_urls):
    snapshots = []
    for url in source_urls:
        try:
            response = requests.get(url, timeout=20, headers={'User-Agent': 'CurriculumAnalyzer/1.0'})
            response.raise_for_status()
            snapshots.append(extract_snapshot(url, response.text))
        except Exception as exc:
            snapshots.append({
                'url': url,
                'error': str(exc),
                'title': '',
                'text': '',
            })
    return snapshots


def extract_snapshot(url, html):
    title_match = re.search(r'<title[^>]*>(.*?)</title>', html, flags=re.IGNORECASE | re.DOTALL)
    meta_desc = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    headings = re.findall(r'<h[12][^>]*>(.*?)</h[12]>', html, flags=re.IGNORECASE | re.DOTALL)
    text = strip_html(html)
    text = re.sub(r'\s+', ' ', text).strip()
    return {
        'url': url,
        'title': clean_text(title_match.group(1)) if title_match else '',
        'description': clean_text(meta_desc.group(1)) if meta_desc else '',
        'headings': [clean_text(h) for h in headings[:20]],
        'text': text[:9000],
    }


def generate_benchmark_from_snapshots(stream_name, snapshots, updated_year):
    text = ' '.join(
        ' '.join([
            snapshot.get('title', ''),
            snapshot.get('description', ''),
            ' '.join(snapshot.get('headings', [])),
            snapshot.get('text', ''),
        ])
        for snapshot in snapshots
    ).lower()

    blueprints = {
        'Java': {
            'benchmark_topics': [
                'Core Java', 'Object-Oriented Programming', 'Collections Framework',
                'Exception Handling', 'Generics', 'Streams and Lambda Expressions',
                'Multithreading and Concurrency', 'JDBC', 'SQL', 'REST APIs',
                'Spring Boot', 'Spring Security', 'Microservices', 'Testing',
                'Design Patterns', 'Cloud Deployment'
            ],
            'required_tools': [
                'JDK 21', 'Maven or Gradle', 'Git', 'JUnit', 'Mockito',
                'Spring Boot', 'Docker', 'Jenkins or GitHub Actions',
                'PostgreSQL or MySQL', 'Postman', 'Kubernetes'
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
        },
        'Python': {
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
        },
        'Data Science': {
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
        },
        'Mechanical': {
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
        },
    }

    blueprint = blueprints.get(stream_name, blueprints['Java'])
    detected_terms = sorted(_extract_live_terms(text))

    benchmark_topics = _merge_with_live_terms(blueprint['benchmark_topics'], detected_terms, limit=16)
    required_tools = _merge_with_live_terms(blueprint['required_tools'], detected_terms, limit=10)
    industry_skills = _merge_with_live_terms(blueprint['industry_skills'], detected_terms, limit=8)
    expected_outcomes = blueprint['expected_outcomes'][:]

    return {
        'benchmark_topics': benchmark_topics,
        'required_tools': required_tools,
        'industry_skills': industry_skills,
        'expected_outcomes': expected_outcomes,
        'updated_year': updated_year,
    }


def _extract_live_terms(text):
    terms = set()
    keyword_groups = {
        'Java': ['spring boot', 'spring security', 'microservices', 'docker', 'kubernetes', 'junit', 'mockito', 'rest api', 'jpa', 'jdbc'],
        'Python': ['fastapi', 'django', 'pytest', 'pandas', 'sqlalchemy', 'jupyter', 'docker', 'automation'],
        'Data Science': ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'mlflow', 'jupyter', 'dashboards', 'responsible ai'],
        'Mechanical': ['autocad', 'solidworks', 'ansys', 'industry 4.0', 'predictive maintenance', 'robotics', 'additive manufacturing'],
    }
    for group in keyword_groups.values():
        for keyword in group:
            if keyword in text:
                terms.add(keyword.title())
    version_matches = re.findall(r'\b(?:java|python|spring boot|django|fastapi|pytorch|tensorflow|autocad|ansys)[^0-9a-z]*(?:v?\d+(?:\.\d+){1,2})\b', text)
    for match in version_matches:
        terms.add(match.title())
    return terms


def _merge_with_live_terms(base_items, live_terms, limit=12):
    merged = []
    seen = set()
    for item in base_items:
        normalized = item.lower()
        if normalized not in seen:
            merged.append(item)
            seen.add(normalized)
        if len(merged) >= limit:
            return merged[:limit]

    for term in live_terms:
        normalized = term.lower()
        if normalized not in seen:
            merged.append(term)
            seen.add(normalized)
        if len(merged) >= limit:
            break
    return merged[:limit]


def strip_html(html):
    html = re.sub(r'(?is)<script.*?>.*?</script>', ' ', html)
    html = re.sub(r'(?is)<style.*?>.*?</style>', ' ', html)
    html = re.sub(r'(?is)<[^>]+>', ' ', html)
    html = html.replace('&nbsp;', ' ')
    html = html.replace('&amp;', '&')
    return html


def clean_text(value):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', str(value))).strip()
