from rest_framework.generics import ListAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import status
from django.db.models import Sum
from datetime import datetime
from chinook.serializers import AlbumSerializer, GenreSerializer, PlaylistSerializer, TrackSimplifiedSerializer, OrderRequestSerializer, OrderResponseSerializer
from chinook.models import Album, Genre, Playlist, Track, Order, Customers
from core.utils import sql_fetch_all


class AlbumListAPIView(ListAPIView):
    #queryset = Album.objects.all()
    '''
       Como a tabela album no banco tem uma ForeignKey relacionada a tabela artist, usando o
       método select_related() do queryset para diminuir o número de consultas, já que a informação
       do album depende das duas tabelas.
    '''
    queryset = Album.objects.select_related('artist') 
    serializer_class = AlbumSerializer


class GenreListAPIView(ListAPIView):
    #queryset = Genre.objects.all()
    '''
        Ao realizar o GenreSerializer estavam sendo realizadas consultas separadas para obter as tracks
        relaicionadas de cada genre, criando um número desnecessário de consultas. 
        Ao utilizar o prefetch_related('tracks') é realizado uma busca por todas as tracks do mesmo genre.
    '''
    queryset = Genre.objects.prefetch_related('tracks')
    serializer_class = GenreSerializer


class PlaylistListAPIView(ListAPIView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class TrackListAPIView(ListAPIView):
    queryset = Track.objects.all().only('id', 'name', 'composer')  # Selected only the fields that will be used.
    serializer_class = TrackSimplifiedSerializer


class ReportDataAPIView(GenericAPIView):
    def get(self, request, *args, **kwargs):
        
        dado = sql_fetch_all(
            """
                SELECT 
                    customers.[CustomerId], 
                    customers.[FirstName], 
                    customers.[LastName], 
                    customers.[Company], 
                    customers.[Address], 
                    customers.[City], 
                    customers.[State], 
                    customers.[Country], 
                    customers.[PostalCode], 
                    customers.[Phone], 
                    customers.[Fax], 
                    customers.[Email], 
                    customers.[SupportRepId],
                    customers.[FirstName] || ' ' || customers.[LastName] as FullName
                FROM customers
                LEFT JOIN employees ON employees.[EmployeeId] = customers.[SupportRepId]
                ORDER BY CustomerId
                
            """
        )

        return Response(dado)
#
class TotalAmountByCustomerAndYear(GenericAPIView):
    def post(self, request, format=None):
        # Validação
        serializer = OrderRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Verificando se o id existe
        customers_id = request.data['customers_id']
        try:
            customers = Customers.objects.get(id=customers_id)
        except Customers.DoesNotExist:
            return Response({'error': 'Invalid customers ID'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificando se o ano está entre 1970 e 2100
        year = request.data['year']
        if not 1970 <= int(year) <= 2100:
            return Response({'error': 'Invalid year'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculando total gasto por ano
        orders = Order.objects.filter(customers=customers, date__year=year).aggregate(Sum('amount'))
        total_amount = orders['amount__sum'] if orders['amount__sum'] is not None else 0

        # Retornando o total gasto por ano
        serializer = OrderResponseSerializer(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["POST"])
def CustomerSimplifiedView(request):
    data = request.data

    try:
        validate_email(data.get("email"))
    except ValidationError:
        return Response({"email": "E-mail inválido."}, status=400)

    customer = Customers(
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        email=data.get("email")
    )
    customer.save()

    return Response({"message": "Cliente cadastrado com sucesso!"}, status=201)