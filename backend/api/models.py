from django.db import models

# ─── Notes Model ───────────────────────────────────────────
class Note(models.Model):
    UNIT_CHOICES = [
        (1, 'Unit 1'),
        (2, 'Unit 2'),
        (3, 'Unit 3'),
        (4, 'Unit 4'),
        (5, 'Unit 5'),
    ]
    title = models.CharField(max_length=200)
    content = models.TextField()
    unit = models.IntegerField(choices=UNIT_CHOICES, default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ─── Algorithm Model ───────────────────────────────────────
class Algorithm(models.Model):
    CATEGORY_CHOICES = [
        ('greedy', 'Greedy'),
        ('dynamic', 'Dynamic Programming'),
        ('divide', 'Divide & Conquer'),
        ('graph', 'Graph Algorithms'),
        ('backtracking', 'Backtracking'),
        ('sorting', 'Sorting'),
    ]
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    time_complexity = models.CharField(max_length=50)
    space_complexity = models.CharField(max_length=50)
    code_python = models.TextField(blank=True)
    code_cpp = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── PYQ Model ─────────────────────────────────────────────
class PYQ(models.Model):
    YEAR_CHOICES = [(y, str(y)) for y in range(2018, 2026)]
    MARKS_CHOICES = [
        (2, '2 Marks'),
        (7, '7 Marks'),
        (14, '14 Marks'),
    ]
    question = models.TextField()
    answer = models.TextField(blank=True)
    year = models.IntegerField(choices=YEAR_CHOICES)
    marks = models.IntegerField(choices=MARKS_CHOICES)
    unit = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} - {self.question[:60]}"


# ─── User Profile (extends default Django user) ────────────
class UserProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    college = models.CharField(max_length=200, default='RGPV')
    semester = models.IntegerField(default=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username