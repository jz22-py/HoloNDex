from rest_framework.pagination import PageNumberPagination

class CardListPagination(PageNumberPagination):
    page_size = 30