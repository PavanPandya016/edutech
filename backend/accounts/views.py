from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer
)
from .models import CustomUser


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new student account
    POST /api/auth/register/
    {
        "username": "john",
        "email": "john@example.com",
        "password": "securepass123",
        "password_confirm": "securepass123",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "1234567890",
        "gender": "M"
    } 
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create auth token for the new user
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Account created successfully',
            'token': token.key,
            'user': UserProfileSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login with username and password
    POST /api/auth/login/
    {
        "username": "john",
        "password": "securepass123"
    }
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        # Get or create token
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'user': UserProfileSerializer(user).data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout - deletes the auth token
    POST /api/auth/logout/
    Headers: Authorization: Token <your_token>
    """
    # Delete token to logout
    request.user.auth_token.delete()
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    GET  /api/auth/profile/ - View your profile
    PUT  /api/auth/profile/ - Update your profile
    Headers: Authorization: Token <your_token>
    """
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True  # Allow partial updates
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change password
    POST /api/auth/change-password/
    {
        "old_password": "oldpass123",
        "new_password": "newpass123",
        "new_password_confirm": "newpass123"
    }
    """
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        # Check old password
        if not request.user.check_password(
            serializer.validated_data['old_password']
        ):
            return Response(
                {'error': 'Old password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        # Regenerate token after password change
        request.user.auth_token.delete()
        token = Token.objects.create(user=request.user)
        
        return Response({
            'message': 'Password changed successfully',
            'token': token.key  # New token
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)