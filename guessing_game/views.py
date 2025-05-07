import random
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Player

def game_view(request):
    if 'number' not in request.session:
        request.session['number'] = random.randint(1, 100)
        request.session['attempts'] = 0
    return render(request, 'guessing_game/game.html')

def leaderboard_view(request):
    top_players = Player.objects.all()[:10]
    return render(request, 'guessing_game/leaderboard.html', {'top_players': top_players})

@require_POST
def guess_number(request):
    try:
        guess = int(request.POST.get('guess'))
        target = request.session.get('number')
        request.session['attempts'] += 1
        
        if guess == target:
            message = f"Congratulations! You've guessed the number {target} in {request.session['attempts']} attempts!"
            attempts = request.session['attempts']
            request.session.pop('number')
            request.session['attempts'] = 0
            return JsonResponse({
                'status': 'win', 
                'message': message,
                'attempts': attempts,
                'show_leaderboard_form': True
            })
        
        difference = abs(target - guess)
        if difference <= 5:
            hint = "You're very close!"
        elif difference <= 10:
            hint = "You're close!"
        elif difference <= 20:
            hint = "You're a bit far."
        else:
            hint = "You're far away."
            
        message = f"Attempt #{request.session['attempts']}: {hint}"
        return JsonResponse({
            'status': 'continue',
            'message': message,
            'attempts': request.session['attempts']
        })
    except (ValueError, TypeError):
        return JsonResponse({'status': 'error', 'message': 'Invalid input. Please enter a number.'}, status=400)

@require_POST
def save_score(request):
    try:
        name = request.POST.get('name')
        score = int(request.POST.get('score'))
        if name and score:
            Player.objects.create(name=name, score=score)
            return JsonResponse({
                'status': 'success',
                'message': 'Score saved successfully!'
            })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_POST
def reset_game(request):
    request.session.pop('number', None)
    request.session['attempts'] = 0
    return JsonResponse({'status': 'reset', 'message': 'Game reset'})