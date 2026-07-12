# payments/urls.py

from django.urls import path
from .views import AlatPayWebhookView

urlpatterns = [
    path(
        "webhook/",
        AlatPayWebhookView.as_view(),
        name="alatpay-webhook",
    ),
]