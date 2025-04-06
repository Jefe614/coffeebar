# admin.py
from django.contrib import admin
from .models import Order, OrderItem, OrderNotification

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'is_delivery', 'payment_method')
    search_fields = ('order_number', 'customer_name', 'customer_email')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_as_preparing']

    def mark_as_preparing(self, request, queryset):
        queryset.update(status='preparing')
    mark_as_preparing.short_description = "Mark selected orders as Preparing"

@admin.register(OrderNotification)
class OrderNotificationAdmin(admin.ModelAdmin):
    list_display = ('order', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read')
    actions = ['mark_as_read']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected as read"