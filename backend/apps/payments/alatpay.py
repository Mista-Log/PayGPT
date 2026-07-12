import requests

from django.conf import settings


class AlatPay:

    @staticmethod
    def generate_payment_link(invoice):

        url = (
            f"{settings.ALATPAY_BASE_URL}"
            "/merchant-onboarding/api/v1/payment/initialize"
        )

        headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": settings.ALATPAY_SECRET_KEY,
        }

        payload = {
            "email": invoice.customer_email,
            "redirectUrl": settings.ALATPAY_REDIRECT_URL,
            "amount": float(invoice.amount),
            "currency": 2,   # NGN according to ALATPay docs
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=30,
        )

        response.raise_for_status()

        return response.json()
    
    @staticmethod
    def verify_payment(reference):

        url = (
            f"{settings.ALATPAY_BASE_URL}"
            f"/merchant-onboarding/api/v1/payment/status/{reference}"
        )

        headers = {
            "Ocp-Apim-Subscription-Key": settings.ALATPAY_SECRET_KEY,
        }

        response = requests.get(url, headers=headers)

        response.raise_for_status()

        return response.json()