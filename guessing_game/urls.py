from django.urls import path
from . import views

app_name = 'guessing_game'

urlpatterns = [
    path('', views.game_view, name='game'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('guess/', views.guess_number, name='guess'),
    path('reset/', views.reset_game, name='reset'),
    path('save-score/', views.save_score, name='save_score'),
]