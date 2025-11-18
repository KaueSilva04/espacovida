import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
// Importando o hook de login que você criou
import { useloginUser } from '../../hooks/userHooks/loginUser.Hook'; // Ajuste o caminho se necessário

import { useNavigate } from 'react-router-dom';

// Não é necessário importar a interface loginUser aqui, pois o hook já a utiliza.

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 'errors' agora irá armazenar tanto erros de validação do formulário quanto erros da API
  const [errors, setErrors] = useState<{ username?: string, password?: string, api?: string }>({});

  // O 'isLoading' foi removido, pois usaremos o 'apiLoading' do seu hook
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Instanciando o hook e renomeando as variáveis para evitar conflitos
  const { loginUser: callLoginApi, loading: apiLoading, error: apiError } = useloginUser();

  // Este useEffect observa erros vindos do hook (apiError)
  // e os adiciona ao nosso estado de erros local.
  useEffect(() => {
    if (apiError) {
      setErrors(prevErrors => ({
        ...prevErrors,
        api: apiError
      }));
    }
  }, [apiError]);

  const validateForm = () => {
    const newErrors: { username?: string, password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 3) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // O handleSubmit agora é assíncrono para esperar a chamada da API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpa mensagens de sucesso ou erros de API anteriores
    setSuccessMessage(null);
    setErrors({});

    // Executa a validação do formulário
    if (!validateForm()) {
      return;
    }

    // O estado de loading (apiLoading) será ativado automaticamente pelo hook

    const userData = { username, password };
    const result = await callLoginApi(userData);

    // O hook retorna 1 em caso de sucesso (com base no seu service)
    if (result === 1) {
      localStorage.setItem('isAuthenticated', 'true');
      setSuccessMessage('Login realizado com sucesso!');
      // Você pode adicionar um redirecionamento ou limpar o formulário aqui
      setUsername('');
      setPassword('');

      setTimeout(() => {
        navigate('/System');
      }, 500);
    }
    // Se 'result' for 'null', o hook já definiu 'apiError',
    // e o useEffect acima cuidará de exibi-lo.
  };

  // Função para limpar erros ao digitar
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username || errors.api) {
      // Limpa o erro do campo específico e o erro da API
      const newErrors = { ...errors };
      delete newErrors.username;
      delete newErrors.api;
      setErrors(newErrors);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password || errors.api) {
      // Limpa o erro do campo específico e o erro da API
      const newErrors = { ...errors };
      delete newErrors.password;
      delete newErrors.api;
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo</h1>
            <p className="text-green-50">Faça login para continuar</p>
          </div>

          <div className="p-8">

            {/* --- Mensagem de Erro da API --- */}
            {errors.api && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center animate-pulse" role="alert">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="font-medium">{errors.api}</span>
              </div>
            )}

            {/* --- Mensagem de Sucesso --- */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center" role="alert">
                {/* Checkmark SVG inline */}
                <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors ${focusedField === 'username' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${errors.username
                      ? 'border-red-500 focus:border-red-600'
                      : focusedField === 'username'
                        ? 'border-green-600'
                        : 'border-gray-300 focus:border-green-600'
                      }`}
                    placeholder="Digite seu usuário"
                    aria-invalid={!!errors.username}
                    aria-describedby="username-error"
                  />
                </div>
                {errors.username && (
                  <div id="username-error" className="mt-2 flex items-center text-red-600 text-sm animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.username}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${errors.password
                      ? 'border-red-500 focus:border-red-600'
                      : focusedField === 'password'
                        ? 'border-green-600'
                        : 'border-gray-300 focus:border-green-600'
                      }`}
                    placeholder="Digite sua senha"
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div id="password-error" className="mt-2 flex items-center text-red-600 text-sm animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-green-600 transition-colors">
                    Lembrar-me
                  </span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/ResetPassword');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={apiLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {apiLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2024 Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
