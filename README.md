# projeto18-valex

- Cartões
    - Criação
        
        **Descrição:**
        
        Nessa rota, empresas com uma chave de API válida podem criar cartões para os seus empregados. Para um cartão ser criado precisamos do identificador do empregado e do tipo do cartão.
        
        **Já existe uma empresa cadastrada no banco com uma chave de API (API Key) válida.**
        
        **Validações:**
        
        - A chave de API deverá ser recebida no header `x-api-key`
        - O tipo do cartão só deve ser uma das seguintes opções: `'groceries', 'restaurants', 'transport', 'education', 'health'`
        
        **Regras de negócio:**
        
        - A chave de API deve pertencer a alguma empresa
        - Somente empregados cadastrados podem ter cartões
        - Empregados não podem ter mais de um cartão do mesmo tipo
        - Utilize a biblioteca [faker](https://fakerjs.dev/guide/#overview) para gerar o número do cartão
        - O nome no cartão deve estar no formato `primeiro nome + iniciais de nomes do meio + ultimo nome` (tudo em caixa alta).
            - Considere nomes do meio apenas nomes que possuírem 3 letras ou mais
            - Ex: para o nome José da Silva Rodrigues o seguinte nome deverá ser gerado
            - `JOSÉ S RODRIGUES`
        - A data de expiração deverá ser o dia atual 5 anos a frente e no formato `MM/YY`
            - Ex: para a data `02/04/2022` a seguinte data de expiração deverá ser gerada
            - `04/27`
        - O código de segurança (CVC) deverá ser persistido de forma criptografado, por ser um dado sensível
            - Utilize a biblioteca [faker](https://fakerjs.dev/guide/#overview) para gerar o CVC
            - Não podemos utilizar o `bcrypt` para criptografar o CVC, pois, precisaremos dele depois e a maneira que o `bcrypt` utiliza para criptografar é impossível de descriptografar. Utilize a biblioteca [cryptr](https://fakerjs.dev/guide/#overview) no lugar
    
    - Ativação de cartão
        
        **Descrição:**
        
        Nessa rota, empregados podem criar ativar seus cartões, isso significa, gerar uma senha para o cartão. Para um cartão ser ativado precisamos do identificador, do CVC do mesmo e da senha que será cadastrada.
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem ser ativados
        - Somente cartões não expirados devem ser ativados
        - Cartões já ativados (com senha cadastrada) não devem poder ser ativados de novo
        - O CVC deverá ser recebido e verificado para garantir a segurança da requisição
        - A senha do cartão deverá ser composta de 4 números
        - A senha do cartão deverá ser persistida de forma criptografado por ser um dado sensível

    - ~~***Visualização de cartões***~~
        
        **Descrição:**
        
        Nessa rota, empregados podem criar visualizar os dados de seus cartões. Para um cartão ser visualizado precisamos do identificador do empregado e da senha dos cartões.
        
        **Retorno esperado:**
        
        ```json
        {
         "cards": [{
          "number": 5595 5595 5595 5595,
          "cardholderName": "FULANO N SILVA",
        	"expirationDate": "04/30",
          "securityCode": "397"
         }]
        }
        ```
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem poder ser visualizados
        - Somente cartões ativos podem ser visualizados
        - A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição

    - Visualização de saldo e transações
        
        **Descrição:**
        
        Nessa rota, empregados podem visualizar o saldo de um cartão e as transações do mesmo. Para isso, precisamos do identificador do cartão.
        
        **Retorno esperado:**
        
        ```json
        {
          "balance": 35000,
          "transactions": [
        		{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
        	],
          "recharges": [
        		{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
        	]
        }
        ```
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem poder ser visualizados
        - O saldo de um cartão equivale a soma de suas recargas menos a soma de suas compras
        
    - Bloqueio de cartão
        
        **Descrição:**
        
        Nessa rota, empregados podem bloquear cartões. Para um cartão ser bloqueado precisamos do identificador e da senha do mesmo.
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem ser bloqueados
        - Somente cartões não expirados devem ser bloqueados
        - Somente cartões não bloqueados devem ser bloqueados
        - A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
    - Desbloqueio de cartão
        
        **Descrição:**
        
        Nessa rota, empregados podem desbloquear cartões. Para um cartão ser desbloqueado precisamos do identificador e da senha do mesmo.
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem ser desbloqueados
        - Somente cartões não expirados devem ser desbloqueados
        - Somente cartões bloqueados devem ser desbloqueados
        - A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
- Recargas
    - Recarga
        
        **Descrição:**
        
        Nessa rota, empresas com uma chave de API válida podem recarregar cartões de seus empregados. Para um cartão ser recarregado precisamos do identificador do mesmo.
        
        **Validações:**
        
        - Somente valores maiores que 0 deveram ser aceitos
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem receber recargas
        - Somente cartões ativos devem receber recargas
        - Somente cartões não expirados devem receber recargas
        - A recarga deve ser persistida
- Compras
    - Compra em POS
        
        **Descrição:**
        
        Nessa rota, empregados podem comprar em *Points of Sale* (maquininhas). Para uma compra em um POS ser efetuada precisamos do identificador do cartão utilizado e da senha do mesmo, do identificador do estabelecimento e do montante da compra.
        
        **Validações:**
        
        - Somente montantes maiores que 0 deveram ser aceitos
        
        **Regras de negócio:**
        
        - Somente cartões cadastrados devem poder comprar
        - Somente cartões ativos devem poder comprar
        - Somente cartões não expirados devem poder comprar
        - Somente cartões não bloqueados devem poder comprar
        - A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
        - Somente estabelecimentos cadastrados devem poder transacionar
        - Somente estabelecimentos do mesmo tipo do cartão devem poder transacionar com ele
        - O cartão deve possuir saldo suficiente para cobrir o montante da compra
        - A compra deve ser persistida no banco de dados