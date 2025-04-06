from django.urls import path
from .views import OrderAPIView, TrackOrderAPIView
from .admin_views import (
    dashboard, 
    order_list, 
    order_detail, 
    ajax_pending_orders,
    mark_all_notifications_read,
    clear_notifications,
    check_notifications,
    mark_notification_read,
    order_quick_view
)

app_name = 'restaurant_admin'

urlpatterns = [
    # API endpoints
    path('orders/', OrderAPIView.as_view(), name='orders'),
    path('orders/track/', TrackOrderAPIView.as_view(), name='track-order'),
    
    # Admin endpoints
    path('restaurant_admin/dashboard/', dashboard, name='dashboard'),
    path('restaurant_admin/orders/', order_list, name='order_list'),
    path('restaurant_admin/orders/<str:status>/', order_list, name='order_list_filtered'),
    path('restaurant_admin/orders/detail/<str:order_number>/', order_detail, name='order_detail'),
    path('restaurant_admin/ajax/pending-orders/', ajax_pending_orders, name='ajax_pending_orders'),
    
    # Notification endpoints
    path('restaurant_admin/notifications/mark-all-read/', mark_all_notifications_read, name='mark_all_notifications_read'),
    path('restaurant_admin/notifications/clear/', clear_notifications, name='clear_notifications'),
    path('restaurant_admin/notifications/check/', check_notifications, name='check_notifications'),
    path('restaurant_admin/notifications/mark-read/<int:notification_id>/', mark_notification_read, name='mark_notification_read'),
    path('restaurant_admin/orders/quick-view/', order_quick_view, name='order_quick_view'),
]