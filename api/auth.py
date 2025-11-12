import base64
import hmac
import json
import time
from hashlib import sha256
from typing import Optional, Tuple

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

from .models import Member

ALGO = 'HS256'


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')


def _b64url_decode(data: str) -> bytes:
    padding = '=' * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def generate_jwt(member_id: int, expires_in_seconds: int = 60 * 60 * 24 * 7) -> str:
    header = {"alg": ALGO, "typ": "JWT"}
    now = int(time.time())
    payload = {"sub": member_id, "iat": now, "exp": now + expires_in_seconds}
    secret = (getattr(settings, 'SECRET_KEY', 'dev-secret') or 'dev-secret').encode('utf-8')

    header_b64 = _b64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(secret, signing_input, sha256).digest()
    signature_b64 = _b64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def verify_jwt(token: str) -> dict:
    try:
        header_b64, payload_b64, signature_b64 = token.split('.')
    except ValueError:
        raise exceptions.AuthenticationFailed('Invalid token format')

    secret = (getattr(settings, 'SECRET_KEY', 'dev-secret') or 'dev-secret').encode('utf-8')
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    expected_sig = hmac.new(secret, signing_input, sha256).digest()
    if not hmac.compare_digest(expected_sig, _b64url_decode(signature_b64)):
        raise exceptions.AuthenticationFailed('Invalid token signature')

    payload = json.loads(_b64url_decode(payload_b64).decode('utf-8'))
    exp = payload.get('exp')
    if not isinstance(exp, int) or exp < int(time.time()):
        raise exceptions.AuthenticationFailed('Token expired')
    return payload


class SimpleUser:
    def __init__(self, member: Member):
        self.member = member
        self.id = member.id
        self.email = member.email
        self.name = member.name

    @property
    def is_authenticated(self):
        return True


class JWTAuthentication(BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request) -> Optional[Tuple[SimpleUser, None]]:
        auth_header = request.headers.get('Authorization') or ''
        parts = auth_header.split(' ')
        if len(parts) != 2 or parts[0] != self.keyword:
            return None
        token = parts[1]
        payload = verify_jwt(token)
        sub = payload.get('sub')
        if not sub:
            raise exceptions.AuthenticationFailed('Invalid token payload')
        try:
            member = Member.objects.get(id=sub)
        except Member.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found')
        request.member = member
        return (SimpleUser(member), None)
