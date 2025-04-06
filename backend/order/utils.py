from datetime import timezone
from django.contrib.auth.models import User
from .models import OrderNotification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
        

def notify_staff_new_order(order):
    """Notify restaurant staff about a new order"""
    try:
        # Get all staff users who should be notified
        staff_users = User.objects.filter(
            groups__name='Restaurant Staff',
            is_active=True
        )
        
        for user in staff_users:
            OrderNotification.objects.create(
                order=order,
                notification_type='new_order',
                message=f"New order #{order.order_number} received from {order.customer_name}",
                staff_member=user.restaurantstaff 
            )
        
        send_real_time_notification(order)
        
    except Exception as e:
        print(f"Error notifying staff: {e}")


def send_real_time_notification(order):
    """Send real-time notification via websockets"""
    try:
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "staff_notifications",
            {
                "type": "order.notification",
                "message": {
                    "order_number": order.order_number,
                    "customer_name": order.customer_name,
                    "total": str(order.total_amount),
                    "status": order.status,
                    "is_delivery": order.is_delivery,
                    "timestamp": str(timezone.now())
                }
            }
        )
    except Exception as e:
        print(f"Could not send real-time notification: {e}")