const KEYS = {
    token: 'TokenRm',
    nome: 'NomeRm',
    tipo: 'TipoRm',
    estabelecimento: 'EstabelecimentoRm',
};

function useAuth() {
    const token = localStorage.getItem(KEYS.token) || '';
    const nome = localStorage.getItem(KEYS.nome) || '';
    const tipo = localStorage.getItem(KEYS.tipo) || '';
    const estabelecimento = localStorage.getItem(KEYS.estabelecimento) || '';

    const isAuthenticated = Boolean(token);

    function logout() {
        localStorage.setItem(KEYS.token, '');
        localStorage.setItem(KEYS.nome, '');
        localStorage.setItem(KEYS.tipo, '');
        localStorage.setItem(KEYS.estabelecimento, '');
    }

    return { token, nome, tipo, estabelecimento, isAuthenticated, logout };
}

export default useAuth;
