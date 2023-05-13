## Prova de SQL
A prova de SQL por simplicidade será feita em SQLite, seu banco de dados se encontra neste repositório, sendo ele
o arquivo `backend/chinook.db`, e caso você não possua um cliente SQLite, você pode encontrar um no seguinte link:
https://portableapps.com/apps/development/sqlite_database_browser_portable

Você pode encontrar um diagrama sobre o que tem disponível neste banco na imagem `chinook_db_schema.jpg`.

## Questões
1 - Utilizando o banco de dados fornecido no arquivo chinook.db prepare uma consulta que mostre o nome do artista e a quantidade albuns que ele lançou, ordenados por quem mais tem albuns.
    Colunas da resposta:
        ArtistName | QtdeAlbums

    SELECT artists.Name AS ArtistName, 
        COUNT(DISTINCT albums.AlbumId) AS QtdeAlbums 
        FROM artists 
        JOIN albums ON artists.ArtistId = albums.ArtistId 
        GROUP BY artists.ArtistId 
        ORDER BY QtdeAlbums DESC;


2 - Prepare uma consulta que traga os 20 clientes que mais gastaram. (Na tabela invoices há as compras feitas por cada cliente e seu valor)
    Colunas da resposta:
        CustomerFullName | Total

    SELECT c.FirstName || ' ' || c.LastName AS CustomerFullName, 
        SUM(i.Total) AS Total 
        FROM customers c 
        JOIN invoices i ON c.CustomerId = i.CustomerId 
        GROUP BY c.CustomerId 
        ORDER BY Total DESC 
        LIMIT 20;

3 - Listar gênero musical com o valor vendido, e a quantidade de vendas.
    Colunas da resposta:
        Genre | TotalSold | QtdeSold

    SELECT genres.Name AS Genre, 
        SUM(invoice_items.UnitPrice * invoice_items.Quantity) AS TotalSold,
        COUNT(DISTINCT invoices.InvoiceId) AS QtdeSold
        FROM genres 
        JOIN tracks ON genres.GenreId = tracks.GenreId 
        JOIN invoice_items ON tracks.TrackId = invoice_items.TrackId 
        JOIN invoices ON invoice_items.InvoiceId = invoices.InvoiceId 
        GROUP BY genres.Name 
        ORDER BY TotalSold DESC;

4 - Listar os albuns com preço, duração total em minutos, tamanho em MB.
    Colunas da resposta:
        AlbumTitle | Price | Duration_minutes | Size_MB

    SELECT albums.Title AS AlbumTitle, 
        albums.Price AS Price, 
        ROUND(SUM(tracks.Milliseconds)/60000.0, 2) AS Duration_minutes,
        ROUND(SUM(tracks.Bytes)/1048576.0, 2) AS Size_MB
        FROM albums
        JOIN tracks ON albums.AlbumId = tracks.AlbumId
        GROUP BY albums.Title
        ORDER BY albums.Title ASC;

5 - Listar empregados com números de clientes, quanto cada um vendeu até o momento, gênero musical que mais vende em qtd (mais popular), e em valor (mais lucrativo).
    Colunas da resposta:
        EmployeeId | EmployeeFullName | QtdeCustomers | TotalSold | MostPopularGenre | MostLucrativeGenre

6 - Consulta que traga a lista de gêneros musicais com 12 colunas (Janeiro a Dezembro) com a qtd de faixas vendidas de um determinado ano a ser especificado num filtro.
    Colunas da resposta:
        GenreId | GenreName | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec

    SELECT 
            g.GenreId, 
            g.Name AS GenreName,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '01' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Jan,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '02' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Feb,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '03' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Mar,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '04' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Apr,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '05' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS May,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '06' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Jun,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '07' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Jul,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '08' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Aug,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '09' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Sep,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '10' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Oct,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '11' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS Nov,
            SUM(CASE WHEN strftime('%m', i.InvoiceDate) = '12' AND strftime('%Y', i.InvoiceDate) = :year THEN il.Quantity ELSE 0 END) AS `Dec`
        FROM genres g
        INNER JOIN tracks t ON t.GenreId = g.GenreId
        INNER JOIN invoice_items il ON il.TrackId = t.TrackId
        INNER JOIN invoices i ON i.InvoiceId = il.InvoiceId
        GROUP BY g.GenreId

7 - Listar supervisores (aqueles funcionários a quem os outros se reportam)
    Há um funcionário que não se reporta a ninguém, este não precisará vir na listagem.
    Há diversos funcionários que ninguém se reporta a eles, este também não devem vir na listagem.
    Aos funcionários que virão na listagem, deverá ser exibida o nome deles, e 12 colunas de meses (Jan-Dez) com o valor que foi vendido por este, ou por alguma das pessoas que se reportam a ele. E outras 12 colunas de meses com a quantidade de faixas vendidas por ele, ou alguém que se reporte a ele.
    Esta tabela será utilizada para gerar gráficos de rendimento das equipes de cada supervisor.
    Deverá conter também uma coluna listando quantos clientes aquela equipe possui.
    Colunas da resposta:
        EmployeeId | EmployeeFullName | QtdeCustomers | 
        TotalSold_Jan | TotalSold_Feb | TotalSold_Mar | TotalSold_Apr | TotalSold_May | TotalSold_Jun |
        TotalSold_Jul | TotalSold_Aug | TotalSold_Sep | TotalSold_Oct | TotalSold_Nov | TotalSold_Dec |
        QtdeTracksSold_Jan | QtdeTracksSold_Feb | QtdeTracksSold_Mar | QtdeTracksSold_Apr | QtdeTracksSold_May | QtdeTracksSold_Jun |
        QtdeTracksSold_Jul | QtdeTracksSold_Aug | QtdeTracksSold_Sep | QtdeTracksSold_Oct | QtdeTracksSold_Nov | QtdeTracksSold_Dec

    SELECT emp.EmployeeId,
        emp.FirstName || ' ' || emp.LastName AS EmployeeFullName,
        COUNT(DISTINCT cus.CustomerId) AS QtdeCustomers,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '01' THEN inv.Total END) AS TotalSold_Jan,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '02' THEN inv.Total END) AS TotalSold_Feb,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '03' THEN inv.Total END) AS TotalSold_Mar,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '04' THEN inv.Total END) AS TotalSold_Apr,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '05' THEN inv.Total END) AS TotalSold_May,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '06' THEN inv.Total END) AS TotalSold_Jun,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '07' THEN inv.Total END) AS TotalSold_Jul,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '08' THEN inv.Total END) AS TotalSold_Aug,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '09' THEN inv.Total END) AS TotalSold_Sep,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '10' THEN inv.Total END) AS TotalSold_Oct,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '11' THEN inv.Total END) AS TotalSold_Nov,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '12' THEN inv.Total END) AS TotalSold_Dec,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '01' THEN ii.Quantity END) AS QtdeTracksSold_Jan,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '02' THEN ii.Quantity END) AS QtdeTracksSold_Feb,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '03' THEN ii.Quantity END) AS QtdeTracksSold_Mar,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '04' THEN ii.Quantity END) AS QtdeTracksSold_Apr,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '05' THEN ii.Quantity END) AS QtdeTracksSold_May,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '06' THEN ii.Quantity END) AS QtdeTracksSold_Jun,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '07' THEN ii.Quantity END) AS QtdeTracksSold_Jul,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '08' THEN ii.Quantity END) AS QtdeTracksSold_Aug,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '09' THEN ii.Quantity END) AS QtdeTracksSold_Sep,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '10' THEN ii.Quantity END) AS QtdeTracksSold_Oct,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '11' THEN ii.Quantity END) AS QtdeTracksSold_Nov,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '12' THEN ii.Quantity END) AS QtdeTracksSold_Dec
    FROM employees emp
    LEFT JOIN customers cus ON emp.EmployeeId = cus.SupportRepId
    LEFT JOIN invoices inv ON cus.CustomerId = inv.CustomerId
    LEFT JOIN invoice_items ii ON inv.InvoiceId = ii.InvoiceId
    WHERE emp.ReportsTo IS NOT NULL AND emp.EmployeeId IN (
    SELECT DISTINCT SupportRepId FROM customers
    )
    GROUP BY emp.EmployeeId, EmployeeFullName;

8 - Criar uma View que possibilite mostrar os dados da lista de supervisores mencionada acima (questão 7), e que possibilite ser filtrada por ano.
    Quero fazer a consulta simplesmente com `select * from vw_lista_supervisores where ano = 2015`.
    Atenção: A resolução dessa questão é a apresentação do script de criação dessa View. E não a criação dela dentro do banco de
        dados que se encontra neste repositório. Se o candidato apenas criar a view dentro do banco de dados mas não apresentar
        o script por escrito na prova, será considerado como não tendo respondido.

    CREATE VIEW vw_lista_supervisores AS
    SELECT emp.EmployeeId,
        emp.FirstName || ' ' || emp.LastName AS EmployeeFullName,
        COUNT(DISTINCT cus.CustomerId) AS QtdeCustomers,
        strftime('%Y', inv.InvoiceDate) AS Ano,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '01' THEN inv.Total END) AS TotalSold_Jan,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '02' THEN inv.Total END) AS TotalSold_Feb,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '03' THEN inv.Total END) AS TotalSold_Mar,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '04' THEN inv.Total END) AS TotalSold_Apr,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '05' THEN inv.Total END) AS TotalSold_May,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '06' THEN inv.Total END) AS TotalSold_Jun,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '07' THEN inv.Total END) AS TotalSold_Jul,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '08' THEN inv.Total END) AS TotalSold_Aug,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '09' THEN inv.Total END) AS TotalSold_Sep,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '10' THEN inv.Total END) AS TotalSold_Oct,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '11' THEN inv.Total END) AS TotalSold_Nov,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '12' THEN inv.Total END) AS TotalSold_Dec,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '01' THEN ii.Quantity END) AS QtdeTracksSold_Jan,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '02' THEN ii.Quantity END) AS QtdeTracksSold_Feb,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '03' THEN ii.Quantity END) AS QtdeTracksSold_Mar,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '04' THEN ii.Quantity END) AS QtdeTracksSold_Apr,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '05' THEN ii.Quantity END) AS QtdeTracksSold_May,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '06' THEN ii.Quantity END) AS QtdeTracksSold_Jun,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '07' THEN ii.Quantity END) AS QtdeTracksSold_Jul,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '08' THEN ii.Quantity END) AS QtdeTracksSold_Aug,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '09' THEN ii.Quantity END) AS QtdeTracksSold_Sep,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '10' THEN ii.Quantity END) AS QtdeTracksSold_Oct,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '11' THEN ii.Quantity END) AS QtdeTracksSold_Nov,
        SUM(CASE WHEN strftime('%m', inv.InvoiceDate) = '12' THEN ii.Quantity END) AS QtdeTracksSold_Dec
    FROM employees emp
    LEFT JOIN customers cus ON emp.EmployeeId = cus.SupportRepId
    LEFT JOIN invoices inv ON cus.CustomerId = inv.CustomerId
    LEFT JOIN invoice_items ii ON inv.InvoiceId = ii.InvoiceId
    WHERE emp.ReportsTo IS NOT NULL AND emp.EmployeeId IN (
    SELECT DISTINCT SupportRepId FROM customers
    )
    GROUP BY emp.EmployeeId, EmployeeFullName, Ano;