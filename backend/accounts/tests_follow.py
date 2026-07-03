from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


class FollowAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Cria dois usuários: follower e streamer
        self.follower = User.objects.create_user(username='follower', password='pass1234')
        self.streamer = User.objects.create_user(username='streamer', password='pass1234', is_streamer=True)

    def test_follow_unfollow_flow(self):
        url = f'/api/accounts/streamer/{self.streamer.username}/follow/'

        # Sem autenticação: deve retornar 401 ao tentar seguir
        res = self.client.post(url)
        self.assertEqual(res.status_code, 401)

        # Autentica como follower
        self.client.force_authenticate(user=self.follower)

        # Inicialmente não segue
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data.get('is_following'))

        # Seguir (POST)
        res = self.client.post(url)
        self.assertIn(res.status_code, (200, 201))
        self.assertEqual(res.data.get('followers_count'), 1)

        # Verifica que agora segue
        res = self.client.get(url)
        self.assertTrue(res.data.get('is_following'))

        # Deixar de seguir (DELETE)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data.get('followers_count'), 0)
