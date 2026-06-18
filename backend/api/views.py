from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Note, Algorithm, PYQ, UserProfile

import anthropic
from django.conf import settings


# ─── AI Chat View ──────────────────────────────────────────
@api_view(['POST'])
def ai_chat(request):
    user_message = request.data.get('message', '')
    history = request.data.get('history', [])

    if not user_message:
        return Response(
            {'error': 'No message provided'},
            status=status.HTTP_400_BAD_REQUEST
        )

    system_prompt = """You are ADA Assistant — an expert AI tutor built into the ADA Learning Platform for RGPV university students studying Analysis and Design of Algorithms (ADA).

You have deep knowledge of:
- All 5 units of RGPV ADA syllabus
- Unit 1: Algorithm intro, asymptotic notations (Big-O, Omega, Theta), Divide & Conquer (Binary Search, Merge Sort, Quick Sort, Strassen), Recurrence Relations, Master Theorem
- Unit 2: Greedy Algorithms (Activity Selection, Fractional Knapsack, Huffman Coding), Graph Algorithms (Kruskal, Prim, Dijkstra, Bellman-Ford)
- Unit 3: Dynamic Programming (0/1 Knapsack, LCS, Matrix Chain Multiplication, Floyd-Warshall)
- Unit 4: Backtracking (N-Queens, Graph Coloring, Hamiltonian Circuit, Subset Sum)
- Unit 5: NP Completeness, NP-Hard, NP-Complete, Branch and Bound, TSP
- RGPV previous year questions and their solutions
- Time and space complexity analysis
- Algorithm pseudocode and implementations in Python and C++

You can also help with:
- General programming questions
- Data structures
- Any computer science topic
- Math and logic problems
- Any other question the user asks

Personality:
- Friendly, encouraging, and clear
- Use examples and step-by-step explanations
- Format responses with proper structure
- For algorithms, always mention time and space complexity
- When solving PYQs, give complete exam-style answers

Always be helpful regardless of whether the question is related to ADA or not."""

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        # Build message history (last 10 turns for context)
        messages = []
        for msg in history[-10:]:
            messages.append({
                'role': msg['role'],
                'content': msg['content']
            })
        messages.append({'role': 'user', 'content': user_message})

        response = client.messages.create(
            model='claude-sonnet-4-6',   # ✅ Fixed: updated to current model
            max_tokens=2048,
            system=system_prompt,
            messages=messages
        )

        ai_reply = response.content[0].text

        return Response({
            'reply': ai_reply,
            'status': 'success'
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ─── Visualizer Views ──────────────────────────────────────
@api_view(['GET'])
def get_visualizer_algorithms(request):
    algorithms = [
        {
            'id': 'bubble-sort',
            'name': 'Bubble Sort',
            'category': 'Sorting',
            'unit': 1,
            'time_best': 'O(n)',
            'time_avg': 'O(n²)',
            'time_worst': 'O(n²)',
            'space': 'O(1)',
            'description': 'Repeatedly swaps adjacent elements if they are in wrong order.',
            'stable': True,
        },
        {
            'id': 'selection-sort',
            'name': 'Selection Sort',
            'category': 'Sorting',
            'unit': 1,
            'time_best': 'O(n²)',
            'time_avg': 'O(n²)',
            'time_worst': 'O(n²)',
            'space': 'O(1)',
            'description': 'Finds minimum element and places it at beginning in each pass.',
            'stable': False,
        },
        {
            'id': 'insertion-sort',
            'name': 'Insertion Sort',
            'category': 'Sorting',
            'unit': 1,
            'time_best': 'O(n)',
            'time_avg': 'O(n²)',
            'time_worst': 'O(n²)',
            'space': 'O(1)',
            'description': 'Builds sorted array one element at a time by inserting into correct position.',
            'stable': True,
        },
        {
            'id': 'merge-sort',
            'name': 'Merge Sort',
            'category': 'Sorting',
            'unit': 1,
            'time_best': 'O(n log n)',
            'time_avg': 'O(n log n)',
            'time_worst': 'O(n log n)',
            'space': 'O(n)',
            'description': 'Divides array into halves, sorts each half, then merges them.',
            'stable': True,
        },
        {
            'id': 'quick-sort',
            'name': 'Quick Sort',
            'category': 'Sorting',
            'unit': 1,
            'time_best': 'O(n log n)',
            'time_avg': 'O(n log n)',
            'time_worst': 'O(n²)',
            'space': 'O(log n)',
            'description': 'Picks a pivot and partitions array around it recursively.',
            'stable': False,
        },
        {
            'id': 'binary-search',
            'name': 'Binary Search',
            'category': 'Searching',
            'unit': 1,
            'time_best': 'O(1)',
            'time_avg': 'O(log n)',
            'time_worst': 'O(log n)',
            'space': 'O(1)',
            'description': 'Searches sorted array by repeatedly halving the search space.',
            'stable': None,
        },
    ]
    return Response(algorithms)


# ─── Test API ──────────────────────────────────────────────
@api_view(['GET'])
def test_api(request):
    return Response({
        'message': 'ADA Platform API is running!',
        'status': 'success'
    })


# ─── Notes Views ───────────────────────────────────────────
@api_view(['GET'])
def get_notes(request):
    unit = request.query_params.get('unit', None)
    if unit:
        notes = Note.objects.filter(unit=unit)
    else:
        notes = Note.objects.all()

    data = [
        {
            'id': n.id,
            'title': n.title,
            'content': n.content,
            'unit': n.unit,
            'created_at': n.created_at,
        }
        for n in notes
    ]
    return Response(data)


# ─── Algorithm Views ───────────────────────────────────────
@api_view(['GET'])
def get_algorithms(request):
    category = request.query_params.get('category', None)
    if category:
        algorithms = Algorithm.objects.filter(category=category)
    else:
        algorithms = Algorithm.objects.all()

    data = [
        {
            'id': a.id,
            'name': a.name,
            'category': a.category,
            'description': a.description,
            'time_complexity': a.time_complexity,
            'space_complexity': a.space_complexity,
            'code_python': a.code_python,
            'code_cpp': a.code_cpp,
        }
        for a in algorithms
    ]
    return Response(data)


# ─── PYQ Views ─────────────────────────────────────────────
@api_view(['GET'])
def get_pyqs(request):
    year = request.query_params.get('year', None)
    unit = request.query_params.get('unit', None)
    pyqs = PYQ.objects.all()

    if year:
        pyqs = pyqs.filter(year=year)
    if unit:
        pyqs = pyqs.filter(unit=unit)

    data = [
        {
            'id': p.id,
            'question': p.question,
            'answer': p.answer,
            'year': p.year,
            'marks': p.marks,
            'unit': p.unit,
        }
        for p in pyqs
    ]
    return Response(data)


# ─── Auth Views ────────────────────────────────────────────
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password or not email:
        return Response(
            {'error': 'Please provide username, email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    UserProfile.objects.create(user=user)

    return Response({
        'message': 'Account created successfully!',
        'username': user.username,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        return Response({
            'message': 'Login successful!',
            'username': user.username,
            'email': user.email,
        })
    else:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )