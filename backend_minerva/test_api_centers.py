"""
Script de teste para verificar a API de centros
Execute: python test_api_centers.py
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
EMAIL = "admin@admin.com"
PASSWORD = "admin123"

def get_token():
    """Obtem token JWT"""
    response = requests.post(
        f"{BASE_URL}/accounts/token/",
        json={"email": EMAIL, "password": PASSWORD}
    )
    if response.status_code == 200:
        return response.json()["access"]
    else:
        print(f"Erro ao obter token: {response.status_code}")
        print(response.text)
        return None

def test_management_centers(token):
    """Testa endpoint de Management Centers"""
    headers = {"Authorization": f"Bearer {token}"}

    print("\n" + "="*80)
    print("TESTE: Management Centers - Sem Filtro")
    print("="*80)
    response = requests.get(f"{BASE_URL}/center/management-centers/", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total de registros: {data['count']}")
        print(f"Registros na página: {len(data['results'])}")
        print("\nPrimeiros 3 registros:")
        for center in data['results'][:3]:
            print(f"  - ID: {center['id']}, Nome: {center['name']}, Ativo: {center['is_active']}")
    else:
        print(f"Erro: {response.text}")

    print("\n" + "="*80)
    print("TESTE: Management Centers - Com Filtro is_active=true")
    print("="*80)
    response = requests.get(
        f"{BASE_URL}/center/management-centers/?is_active=true",
        headers=headers
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total de registros ativos: {data['count']}")
        print(f"Registros na página: {len(data['results'])}")
        print("\nPrimeiros 3 registros:")
        for center in data['results'][:3]:
            print(f"  - ID: {center['id']}, Nome: {center['name']}, Ativo: {center['is_active']}")
    else:
        print(f"Erro: {response.text}")

def test_requesting_centers(token):
    """Testa endpoint de Requesting Centers"""
    headers = {"Authorization": f"Bearer {token}"}

    print("\n" + "="*80)
    print("TESTE: Requesting Centers - Sem Filtro")
    print("="*80)
    response = requests.get(f"{BASE_URL}/center/requesting-centers/", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total de registros: {data['count']}")
        print(f"Registros na página: {len(data['results'])}")
        print("\nPrimeiros 3 registros:")
        for center in data['results'][:3]:
            print(f"  - ID: {center['id']}, Nome: {center['name']}")
            print(f"    Centro Gestor: {center['management_center']['name']}")
            print(f"    Ativo: {center['is_active']}")
    else:
        print(f"Erro: {response.text}")

    print("\n" + "="*80)
    print("TESTE: Requesting Centers - Com Filtro is_active=true")
    print("="*80)
    response = requests.get(
        f"{BASE_URL}/center/requesting-centers/?is_active=true",
        headers=headers
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total de registros ativos: {data['count']}")
        print(f"Registros na página: {len(data['results'])}")
        print("\nPrimeiros 3 registros:")
        for center in data['results'][:3]:
            print(f"  - ID: {center['id']}, Nome: {center['name']}")
            print(f"    Centro Gestor: {center['management_center']['name']}")
            print(f"    Ativo: {center['is_active']}")
    else:
        print(f"Erro: {response.text}")

def main():
    print("Iniciando testes da API de Centros...")
    print(f"URL Base: {BASE_URL}")
    print(f"Usuário: {EMAIL}")

    token = get_token()
    if not token:
        print("\nFalha ao obter token. Verifique se o servidor está rodando e as credenciais estão corretas.")
        return

    print(f"\nToken obtido com sucesso!")

    test_management_centers(token)
    test_requesting_centers(token)

    print("\n" + "="*80)
    print("TESTES CONCLUÍDOS")
    print("="*80)

if __name__ == "__main__":
    main()
