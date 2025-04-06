# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'] == AnonymousUser():
            await self.close()
            return
            
        self.group_name = f'staff_{self.scope["user"].id}'
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def order_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'order_number': event['order_number'],
            'customer_name': event['customer_name'],
            'status': event.get('status', ''),
        }))