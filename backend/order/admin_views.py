# admin_views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.db.models import Count, Sum
from .models import Order, OrderNotification
from django.contrib.auth.decorators import user_passes_test

def staff_required(view_func):
    return user_passes_test(
        lambda u: u.is_active and (u.is_staff or u.groups.filter(name='Restaurant Staff').exists()),
        login_url='/admin/login/'
    )(view_func)

@staff_required
def dashboard(request):
    # Order status counts
    status_counts = Order.objects.values('status').annotate(count=Count('id'))
    status_map = {s['status']: s['count'] for s in status_counts}

    # Today's stats
    today = timezone.now().date()
    today_orders = Order.objects.filter(created_at__date=today)
    today_stats = today_orders.aggregate(
        count=Count('id'),
        revenue=Sum('total_amount')
    )

    # Recent orders (last 10)
    recent_orders = Order.objects.all().order_by('-created_at')[:10]

    # Unread notifications for current user if they have a RestaurantStaff profile
    unread_notifications = 0
    if hasattr(request.user, 'restaurantstaff'):
        unread_notifications = OrderNotification.objects.filter(
            staff_member=request.user.restaurantstaff,
            is_read=False
        ).count()

    context = {
        'pending_count': status_map.get('pending', 0),
        'confirmed_count': status_map.get('confirmed', 0),
        'preparing_count': status_map.get('preparing', 0),
        'out_for_delivery_count': status_map.get('out_for_delivery', 0),
        'delivered_count': status_map.get('delivered', 0),
        'cancelled_count': status_map.get('cancelled', 0),
        'today_orders_count': today_stats['count'] or 0,
        'today_revenue': today_stats['revenue'] or 0,
        'recent_orders': recent_orders,
        'unread_notifications': unread_notifications,
    }
    return render(request, 'admin/dashboard.html', context)

@staff_required
def order_list(request, status=None):
    orders = Order.objects.all().order_by('-created_at')
    
    if status:
        orders = orders.filter(status=status)
        title = f"{status.replace('_', ' ').title()} Orders"
    else:
        title = "All Orders"
    
    context = {
        'orders': orders,
        'title': title,
        'current_status': status,
    }
    return render(request, 'admin/order_list.html', context)

@staff_required
def order_detail(request, order_number):
    order = get_object_or_404(Order, order_number=order_number)
    
    if request.method == 'POST':
        new_status = request.POST.get('status')
        if new_status in dict(Order.ORDER_STATUS_CHOICES).keys():
            order.status = new_status
            order.save()
            
            # Create notification for status change
            OrderNotification.objects.create(
                order=order,
                notification_type='status_change',
                message=f"Order #{order.order_number} status changed to {order.get_status_display()}",
                staff_member=request.user.restaurantstaff
            )
    
    context = {
        'order': order,
        'status_choices': Order.ORDER_STATUS_CHOICES,
    }
    return render(request, 'admin/order_detail.html', context)

@staff_required
def ajax_pending_orders(request):
    # For real-time updates
    pending_orders = Order.objects.filter(status='pending').order_by('-created_at')[:5]
    data = {
        'orders': [
            {
                'order_number': o.order_number,
                'customer_name': o.customer_name,
                'created_at': o.created_at.isoformat(),
            }
            for o in pending_orders
        ]
    }
    return JsonResponse(data)


@staff_required
def mark_all_notifications_read(request):
    if hasattr(request.user, 'restaurantstaff'):
        OrderNotification.objects.filter(
            staff_member=request.user.restaurantstaff,
            is_read=False
        ).update(is_read=True)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

@staff_required
def clear_notifications(request):
    if hasattr(request.user, 'restaurantstaff'):
        OrderNotification.objects.filter(
            staff_member=request.user.restaurantstaff
        ).delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

@staff_required
def check_notifications(request):
    if hasattr(request.user, 'restaurantstaff'):
        notifications = OrderNotification.objects.filter(
            staff_member=request.user.restaurantstaff,
            is_read=False
        ).order_by('-created_at')[:10]
        
        return JsonResponse({
            'new_notifications': notifications.count(),
            'notifications': [{
                'id': n.id,
                'title': n.get_notification_type_display(),
                'message': n.message,
                'order_id': n.order.id,
                'created_at': n.created_at.isoformat(),
                'is_read': n.is_read
            } for n in notifications]
        })
    return JsonResponse({'new_notifications': 0})

# @staff_required
def mark_notification_read(request, notification_id):
    if hasattr(request.user, 'restaurantstaff'):
        notification = get_object_or_404(
            OrderNotification,
            id=notification_id,
            staff_member=request.user.restaurantstaff
        )
        notification.is_read = True
        notification.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

@staff_required
def order_quick_view(request):
    order_id = request.GET.get('order_id')
    order = get_object_or_404(Order, id=order_id)
    
    return JsonResponse({
        'success': True,
        'order': {
            'order_number': order.order_number,
            'customer_name': order.customer_name,
            'total_amount': str(order.total_amount),
            'status': order.status,
            'status_display': order.get_status_display(),
            'items': [{
                'name': item.name,
                'quantity': item.quantity,
                'subtotal': str(item.subtotal)
            } for item in order.items.all()]
        }
    })