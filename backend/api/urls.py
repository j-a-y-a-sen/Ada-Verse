from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.test_api, name="test-api"),
    path("notes/", views.get_notes, name="get-notes"),
    path("algorithms/", views.get_algorithms, name="get-algorithms"),

    path(
        "visualizer/algorithms/",
        views.get_visualizer_algorithms,
        name="get-visualizer-algorithms",
    ),

    path("pyqs/", views.get_pyqs, name="get-pyqs"),

    path("register/", views.register_user, name="register"),
    path("login/", views.login_user, name="login"),

    path("chat/", views.ai_chat, name="ai-chat"),
    path("ai-chat/", views.ai_chat, name="ai-chat-legacy"),
]