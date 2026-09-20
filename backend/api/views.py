import json

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Note, Algorithm, PYQ, UserProfile


# ============================================================
# TEST API
# ============================================================

@api_view(["GET"])
def test_api(request):
    return Response(
        {
            "message": "ADAverse API is working!",
            "status": "success",
        },
        status=status.HTTP_200_OK,
    )


# ============================================================
# NOTES
# ============================================================

@api_view(["GET"])
def get_notes(request):
    try:
        notes = Note.objects.all()

        data = []

        for note in notes:
            data.append(
                {
                    "id": note.id,
                    "title": getattr(note, "title", ""),
                    "content": getattr(note, "content", ""),
                }
            )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "error": str(e),
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# ALGORITHMS
# ============================================================

@api_view(["GET"])
def get_algorithms(request):
    try:
        algorithms = Algorithm.objects.all()

        data = []

        for algorithm in algorithms:
            data.append(
                {
                    "id": algorithm.id,
                    "name": getattr(algorithm, "name", ""),
                    "description": getattr(
                        algorithm,
                        "description",
                        "",
                    ),
                    "category": getattr(
                        algorithm,
                        "category",
                        "",
                    ),
                }
            )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "error": str(e),
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# VISUALIZER ALGORITHMS
# ============================================================

@api_view(["GET"])
def get_visualizer_algorithms(request):
    try:
        algorithms = Algorithm.objects.all()

        data = []

        for algorithm in algorithms:
            data.append(
                {
                    "id": algorithm.id,
                    "name": getattr(
                        algorithm,
                        "name",
                        "",
                    ),
                    "description": getattr(
                        algorithm,
                        "description",
                        "",
                    ),
                    "category": getattr(
                        algorithm,
                        "category",
                        "",
                    ),
                }
            )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "error": str(e),
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# PYQs
# ============================================================

@api_view(["GET"])
def get_pyqs(request):
    try:
        pyqs = PYQ.objects.all()

        data = []

        for pyq in pyqs:
            data.append(
                {
                    "id": pyq.id,
                    "question": getattr(
                        pyq,
                        "question",
                        "",
                    ),
                    "answer": getattr(
                        pyq,
                        "answer",
                        "",
                    ),
                    "year": getattr(
                        pyq,
                        "year",
                        "",
                    ),
                }
            )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "error": str(e),
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# REGISTER
# ============================================================

@api_view(["POST"])
def register_user(request):

    username = request.data.get(
        "username",
        "",
    )

    email = request.data.get(
        "email",
        "",
    )

    password = request.data.get(
        "password",
        "",
    )

    if not username or not password:
        return Response(
            {
                "error": (
                    "Username and password "
                    "are required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(
        username=username
    ).exists():

        return Response(
            {
                "error": (
                    "Username already exists."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        return Response(
            {
                "message": (
                    "User registered successfully."
                ),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:

        return Response(
            {
                "error": str(e),
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# LOGIN
# ============================================================

@api_view(["POST"])
def login_user(request):

    username = request.data.get(
        "username",
        "",
    )

    password = request.data.get(
        "password",
        "",
    )

    if not username or not password:
        return Response(
            {
                "error": (
                    "Username and password "
                    "are required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(
        username=username,
        password=password,
    )

    if user is not None:

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_200_OK,
        )

    return Response(
        {
            "error": (
                "Invalid username or password."
            )
        },
        status=status.HTTP_401_UNAUTHORIZED,
    )


# ============================================================
# AI RESPONSE SCHEMA
# ============================================================

AI_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {

        "response_type": {
            "type": "STRING",
            "enum": [
                "answer",
                "clarification",
                "quiz",
            ],
        },

        "title": {
            "type": "STRING",
        },

        "intro": {
            "type": "STRING",
        },

        "blocks": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {

                    "type": {
                        "type": "STRING",
                        "enum": [
                            "text",
                            "code",
                            "diagram",
                            "flowchart",
                            "table",
                            "complexity",
                            "quiz",
                            "animation",
                        ],
                    },

                    "title": {
                        "type": "STRING",
                    },

                    "content": {
                        "type": "STRING",
                    },

                    "language": {
                        "type": "STRING",
                    },

                    "items": {
                        "type": "ARRAY",
                        "items": {
                            "type": "STRING",
                        },
                    },

                    "columns": {
                        "type": "ARRAY",
                        "items": {
                            "type": "STRING",
                        },
                    },

                    "rows": {
                        "type": "ARRAY",
                        "items": {
                            "type": "ARRAY",
                            "items": {
                                "type": "STRING",
                            },
                        },
                    },

                    "best": {
                        "type": "STRING",
                    },

                    "average": {
                        "type": "STRING",
                    },

                    "worst": {
                        "type": "STRING",
                    },

                    "space": {
                        "type": "STRING",
                    },

                    "question": {
                        "type": "STRING",
                    },

                    "options": {
                        "type": "ARRAY",
                        "items": {
                            "type": "STRING",
                        },
                    },

                    "answer": {
                        "type": "STRING",
                    },

                    "explanation": {
                        "type": "STRING",
                    },

                    "algorithm": {
                        "type": "STRING",
                    },
                },

                "required": [
                    "type",
                    "title",
                    "content",
                    "language",
                    "items",
                    "columns",
                    "rows",
                    "best",
                    "average",
                    "worst",
                    "space",
                    "question",
                    "options",
                    "answer",
                    "explanation",
                    "algorithm",
                ],
            },
        },
    },

    "required": [
        "response_type",
        "title",
        "intro",
        "blocks",
    ],
}


# ============================================================
# AI ASSISTANT — GEMINI
# ============================================================

@api_view(["POST"])
def ai_chat(request):

    # --------------------------------------------------------
    # Get request data
    # --------------------------------------------------------

    user_message = request.data.get(
        "message",
        "",
    )

    history = request.data.get(
        "history",
        [],
    )

    page_context = request.data.get(
        "context",
        {},
    )

    # --------------------------------------------------------
    # Validate message
    # --------------------------------------------------------

    if (
        not isinstance(
            user_message,
            str,
        )
        or not user_message.strip()
    ):

        return Response(
            {
                "error": "No message provided.",
                "status": "error",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # --------------------------------------------------------
    # Get API key safely
    # --------------------------------------------------------

    gemini_api_key = getattr(
        settings,
        "GEMINI_API_KEY",
        "",
    )

    if not gemini_api_key:

        return Response(
            {
                "error": (
                    "Gemini API key is not configured. "
                    "Please add GEMINI_API_KEY "
                    "to backend/.env."
                ),
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # --------------------------------------------------------
    # Clean page context
    # --------------------------------------------------------

    if not isinstance(
        page_context,
        dict,
    ):
        page_context = {}

    current_page = page_context.get(
        "page",
        "",
    )

    current_query = page_context.get(
        "query",
        "",
    )

    # --------------------------------------------------------
    # SYSTEM PROMPT
    # --------------------------------------------------------

    system_prompt = """
You are ADAverse AI, the AI tutor inside ADAverse.

Your main purpose is helping students with:

- Analysis and Design of Algorithms (ADA)
- Data Structures
- Programming
- Computer Science
- Data Analytics
- Mathematics related to Computer Science
- RGPV academic subjects
- Competitive programming
- Technical interview preparation

You can also answer general questions.

IMPORTANT:

You are a real educational AI assistant.

Give the user the answer they actually need.

Keep answers reasonably concise unless the user asks for
a detailed explanation.

Assume the student may be a beginner.

For programming questions:

- explain the idea first
- explain why the code works
- use examples
- explain important lines
- give complexity when relevant

For algorithm questions, use useful sections such as:

- Intuition
- Approach
- Example
- Code
- Dry Run
- Complexity

Do NOT force every section into every answer.

VISUAL LEARNING:

Use structured blocks when they genuinely help.

Possible block types:

text
code
diagram
flowchart
table
complexity
quiz
animation

Do not create unnecessary blocks.

ANIMATION:

If the user asks to visualize an algorithm that exists
in the ADAverse visualizer, create an animation block.

Put the algorithm ID in the "algorithm" field.

Known visualizer IDs include:

bubble-sort
selection-sort
insertion-sort
merge-sort
quick-sort
heap-sort
binary-search
linear-search
optimal-merge
prim-mst
knapsack
multistage
graph-coloring
tsp
bfs
dfs
bst

If the user asks for an algorithm that is not supported
by the visualizer, do not invent an animation.

GENERAL QUESTIONS:

You can answer questions outside ADA normally.

CONVERSATION:

Use the supplied conversation history.

Understand follow-up questions.

For example, if the user asks:

"What about its time complexity?"

use the previous conversation to understand what
"its" refers to.

CLARIFICATION:

Only ask a clarification question when it is genuinely
necessary.

If clarification is needed, keep it short.

STYLE:

Be friendly, clear, practical and engaging.

Do not use unnecessarily complicated language.

Return ONLY the structured JSON required by the
response schema.
"""

    # --------------------------------------------------------
    # Add page context
    # --------------------------------------------------------

    if current_page or current_query:

        system_prompt += f"""

CURRENT ADAverse PAGE CONTEXT:

Page: {current_page}

Query: {current_query}

Use this context when relevant.
"""

    # --------------------------------------------------------
    # Build Gemini conversation
    # --------------------------------------------------------

    contents = []

    # Only send the last 4 messages.
    safe_history = (
        history[-4:]
        if isinstance(history, list)
        else []
    )

    for message in safe_history:

        if not isinstance(
            message,
            dict,
        ):
            continue

        role = message.get(
            "role",
            "",
        )

        content = message.get(
            "content",
            "",
        )

        if not content:
            continue

        if not isinstance(
            content,
            str,
        ):
            content = str(content)

        if role == "assistant":
            gemini_role = "model"
        else:
            gemini_role = "user"

        contents.append(
            {
                "role": gemini_role,
                "parts": [
                    {
                        "text": content,
                    }
                ],
            }
        )

    # --------------------------------------------------------
    # Current user message
    # --------------------------------------------------------

    contents.append(
        {
            "role": "user",
            "parts": [
                {
                    "text": user_message.strip(),
                }
            ],
        }
    )

    # ========================================================
    # GEMINI HELPER
    # ========================================================

    def call_gemini(model_name):

        from google import genai
        from google.genai import types

        client = genai.Client(
            api_key=gemini_api_key
        )

        response = client.models.generate_content(
            model=model_name,
            contents=contents,
            config=types.GenerateContentConfig(

                system_instruction=system_prompt,

                # Low thinking keeps the chatbot fast.
                thinking_config=types.ThinkingConfig(
                    thinking_level="low"
                ),

                # Prevent unnecessarily long answers.
                max_output_tokens=2048,

                # Force structured JSON.
                response_mime_type="application/json",

                response_schema=AI_RESPONSE_SCHEMA,
            ),
        )

        response_text = response.text

        if not response_text:

            raise Exception(
                "Gemini returned an empty response."
            )

        try:

            structured_response = json.loads(
                response_text
            )

        except json.JSONDecodeError:

            raise Exception(
                "Gemini returned invalid JSON."
            )

        return structured_response

    # ========================================================
    # PRIMARY GEMINI REQUEST
    # ========================================================

    try:

        structured_response = call_gemini(
            "gemini-3.8-flash"
        )

        return Response(
            {
                "response": structured_response,
                "status": "success",
            },
            status=status.HTTP_200_OK,
        )

    except Exception as first_error:

        first_error_text = str(
            first_error
        )

        print(
            "\nGemini primary model error:"
        )

        print(first_error_text)

        # ----------------------------------------------------
        # Determine whether fallback is appropriate
        # ----------------------------------------------------

        temporary_error = any(
            code.lower()
            in first_error_text.lower()
            for code in [
                "503",
                "429",
                "unavailable",
                "resource_exhausted",
                "high demand",
                "temporarily unavailable",
                "overloaded",
                "rate limit",
                "quota",
            ]
        )

        # ====================================================
        # FALLBACK MODEL
        # ====================================================

        if temporary_error:

            try:

                print(
                    "\nTrying Gemini fallback model:"
                    " gemini-3.6-flash"
                )

                structured_response = call_gemini(
                    "gemini-3.6-flash"
                )

                return Response(
                    {
                        "response": structured_response,
                        "status": "success",
                    },
                    status=status.HTTP_200_OK,
                )

            except Exception as second_error:

                second_error_text = str(
                    second_error
                )

                print(
                    "\nGemini fallback model error:"
                )

                print(second_error_text)

                return Response(
                    {
                        "error": (
                            "Gemini is currently "
                            "unavailable."
                        ),
                        "details": (
                            second_error_text
                        ),
                        "primary_error": (
                            first_error_text
                        ),
                        "status": "error",
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

        # ====================================================
        # NON-TEMPORARY ERROR
        # ====================================================

        return Response(
            {
                "error": (
                    "The AI request failed."
                ),
                "details": first_error_text,
                "status": "error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )