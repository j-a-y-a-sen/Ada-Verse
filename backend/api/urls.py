from django.urls import path
from . import views

urlpatterns = [
    # ── Test ──────────────────────────────────────────────
    path('test/', views.test_api, name='test-api'),

    # ── Notes ─────────────────────────────────────────────
    path('notes/', views.get_notes, name='get-notes'),

    # ── Algorithms ────────────────────────────────────────
    path('algorithms/', views.get_algorithms, name='get-algorithms'),

    # ── Visualizer ────────────────────────────────────────
    path('visualizer/algorithms/', views.get_visualizer_algorithms, name='get-visualizer-algorithms'),

    # ── PYQs ──────────────────────────────────────────────
    path('pyqs/', views.get_pyqs, name='get-pyqs'),

    # ── Auth ──────────────────────────────────────────────
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),

    # ── AI Chatbot ────────────────────────────────────────
    path('ai-chat/', views.ai_chat, name='ai-chat'),
]