import json
import hashlib
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, ItemSerializer, RatingSerializer
from .models import Item, Rating, StatsShare
from django.contrib.auth.models import User
from django.db import transaction


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'success': True, "username": user.username})
        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logout(request)
        return Response({'success': True})

class StatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({"logged_in": True, "username": request.user.username})
        return Response({"logged_in": False})

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        username = request.data.get("username")
        password = request.data.get("password")

        if username:
            if User.objects.filter(username=username).exclude(id=user.id).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username

        if password:
            user.set_password(password)
            update_session_auth_hash(request, user)

        user.save()

        return Response({"success": True, "username": user.username}, status=status.HTTP_200_OK)

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        with transaction.atomic():
            logout(request)
            user.delete()

        return Response({"success": True}, status=status.HTTP_200_OK)
    

class ItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated] 
    
    def get_queryset(self):
        category = self.kwargs.get('category')
        queryset = Item.objects.filter(category=category)

        return queryset

class QuizItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        category = self.kwargs.get('category')
        rated_ids = Rating.objects.filter(user=self.request.user).values_list("item_id", flat=True)

        queryset = Item.objects.filter(category=category).exclude(id__in=rated_ids)

        return queryset

class RateItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.data.get("id")
        score = request.data.get("score")

        if item_id is None or score is None:
            return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

        rating, _ = Rating.objects.update_or_create(
            user=request.user,
            item_id=item_id,
            defaults={"score": score},
        )

        return Response(RatingSerializer(rating).data, status=status.HTTP_200_OK)

class StatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        category = self.kwargs.get("category")

        ratings = Rating.objects.filter(
            user=request.user,
            item__category=category
        ).select_related('item')
        
        data = [{
            'id': r.item.id,
            'name': r.item.name,
            'image': r.item.image.url, 
            'score': r.score,
            'created_at': r.created_at
        } for r in ratings]
        
        return Response(data)

class CreateStatsShareView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        category = self.kwargs.get("category")

        ratings = Rating.objects.filter(
            user=request.user,
            item__category=category
        ).select_related('item')

        snapshot = [{
            'id': r.item.id,
            'name': r.item.name,
            'image': r.item.image.url,
            'score': r.score,
            'created_at': r.created_at.isoformat()
        } for r in ratings]

        snapshot_json = json.dumps(snapshot, sort_keys=True)
        snapshot_hash = hashlib.sha256(snapshot_json.encode()).hexdigest()

        share, created = StatsShare.objects.get_or_create(
            user=request.user,
            category=category,
            snapshot_hash=snapshot_hash,
            defaults={"snapshot": snapshot},
        )

        return Response({
            "share_url": f"/stats/share/{share.id}"
        }, status=status.HTTP_200_OK)

class SharedStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        share_id = self.kwargs.get("share_id")
        share = get_object_or_404(StatsShare, id=share_id)

        return Response({
            'category': share.category,
            'created_at': share.created_at,
            'data': share.snapshot
        })

