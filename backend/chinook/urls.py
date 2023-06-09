from django.urls import path
from chinook.views import AlbumListAPIView, PlaylistListAPIView, ReportDataAPIView, GenreListAPIView, TrackListAPIView, TotalAmountByCustomerAndYear, CustomerSimplifiedView

urlpatterns = [
    path('albums/', AlbumListAPIView.as_view()),
    path('genres/', GenreListAPIView.as_view()),
    path('tracks/', TrackListAPIView.as_view()),
    path('playlists/', PlaylistListAPIView.as_view()),
    path('report_data/', ReportDataAPIView.as_view()),
    path('total_amount/', TotalAmountByCustomerAndYear.as_view(), name='total-amount-by-customer-year'),
    path('customer_simplified/', CustomerSimplifiedView),
]
