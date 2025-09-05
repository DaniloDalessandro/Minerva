import requests
import json

# Primeiro vamos fazer login para obter o token
login_data = {'email': 'admin@teste.com', 'password': 'admin123'}
try:
    login_response = requests.post('http://localhost:8000/api/v1/accounts/login/', json=login_data)
    if login_response.status_code == 200:
        tokens = login_response.json()
        access_token = tokens.get('access')
        print(f"✅ Login realizado com sucesso")
        
        # Agora fazer a requisição das direções
        headers = {'Authorization': f'Bearer {access_token}'}
        directions_response = requests.get('http://localhost:8000/api/v1/sector/directions/?page_size=1000', headers=headers)
        
        if directions_response.status_code == 200:
            data = directions_response.json()
            print(f'📊 Status da resposta: {directions_response.status_code}')
            print(f'📈 Total count: {data.get("count", 0)}')
            print(f'📋 Results length: {len(data.get("results", []))}')
            print('\n🗂️ Direções retornadas pela API:')
            for d in data.get('results', []):
                print(f'   - {d["id"]}: {d["name"]}')
        else:
            print(f'❌ Erro ao buscar direções: {directions_response.status_code}')
            print(directions_response.text)
    else:
        print(f'❌ Erro no login: {login_response.status_code}')
        print(login_response.text)
except Exception as e:
    print(f'💥 Erro: {e}')