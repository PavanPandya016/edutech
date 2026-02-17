from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'address',
            'gender', 'date_of_birth'
        ]

    def validate(self, data):
        # Check passwords match
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        
        # Check email is unique
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already registered")
        
        return data

    def create(self, validated_data):
        # Remove password_confirm before creating user
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = CustomUser(**validated_data)
        user.set_password(password)  # Hashes the password
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")
        
        data['user'] = user
        return data 
    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'address', 'gender', 'date_of_birth',
            'profile_picture', 'date_joined'
        ]
        read_only_fields = ['id', 'username', 'date_joined']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']: 
            raise serializers.ValidationError("New passwords do not match")
        return data 