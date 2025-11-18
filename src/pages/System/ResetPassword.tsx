import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, HelpCircle, User as UserIcon, ArrowLeft } from 'lucide-react'; // Adicionei ArrowLeft
import { useNavigate } from 'react-router-dom';

// Hooks
import { useListUsersByName } from '../../hooks/userHooks/listUserByName.Hook';
import { useResetPassword } from '../../hooks/userHooks/resetPassword.Hook';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();

  const { fetchUsersByName, loading: searchLoading, error: searchError } = useListUsersByName();
  const { reset, loading: resetLoading, error: resetError } = useResetPassword();

  const [errors, setErrors] = useState<{
    username?: string;
    answer?: string;
    newPassword?: string;
    confirmPassword?: string;
    api?: string;
  }>({});
  
  // Estado para armazenar o ID do usuário
  const [id, setId] = useState<number | string>(''); 
  
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- BUSCAR PERGUNTA ---
  const handleGetQuestion = async () => {
    setErrors({});
    setSecurityQuestion('');
    setId(''); 

    if (!username.trim()) {
      setErrors({ username: "Digite o usuário" });
      return;
    }

    const responseData = await fetchUsersByName({ username: username });

    if (searchError) {
        setErrors(prev => ({ ...prev, api: searchError }));
        return;
    }

    if (!responseData) {
      setErrors({ username: "Usuário não encontrado." });
      return;
    }

    const userObj = Array.isArray(responseData) ? responseData[0] : responseData;
    
    const questionFromApi = (userObj as any).question || (userObj as any).securityQuestion;
    const idFromApi = (userObj as any).id;

    if (!questionFromApi || !idFromApi) {
      setErrors({ username: "Usuário sem pergunta de segurança ou ID." });
      return;
    }

    setSecurityQuestion(questionFromApi);
    setId(idFromApi); 
  };

  // --- VALIDAÇÃO ---
  const validateForm = () => {
    const newErrors: any = {};
    if (errors.api) delete errors.api;

    if (!securityQuestion) newErrors.api = "Busque a pergunta antes de continuar.";
    if (!answer.trim()) newErrors.answer = "Responda a pergunta";
    
    // Validação mínima de 4 caracteres
    if (!newPassword.trim() || newPassword.length < 4) {
      newErrors.newPassword = "A senha deve ter pelo menos 4 caracteres";
    }

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- ENVIAR NOVA SENHA (RESET) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    if (!validateForm()) return;

    const payload = {
      id: id,
      username: username,
      password: newPassword, 
      answer: answer 
    };
    
    const result = await reset(payload as any); 
  
    if (result === 1) {
      setSuccessMessage("Senha redefinida com sucesso! Redirecionando...");
      
      setTimeout(() => {
         navigate("/login"); // Redireciona para o Login (Rota raiz ou /login)
      }, 2000);
      
    } else {
      if (!resetError) {
         setErrors(prev => ({ ...prev, api: "A resposta está incorreta." }));
      }
    }
  };

  const isLoading = searchLoading || resetLoading;
  const displayError = errors.api || searchError || resetError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          
          {/* Botão Voltar Flutuante (Opcional, no topo esquerdo) */}
          <button 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors z-10"
            title="Voltar para o Login"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Redefinir Senha</h1>
            <p className="text-blue-100">Responda sua pergunta de segurança</p>
          </div>

          <div className="p-8">

            {/* Exibição de Erros */}
            {("api" in errors || displayError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center animate-pulse">
                <AlertCircle className="w-5 h-5 mr-2" />
                {displayError}
              </div>
            )}

            {/* Sucesso */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Usuario */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Usuário</label>
                 <div className="relative">
                    <input
                      type="text"
                      className={`w-full border-2 rounded-lg p-3 pl-10 ${"username" in errors ? "border-red-500" : "border-gray-300 focus:border-blue-600"}`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      readOnly={!!securityQuestion} 
                    />
                    <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                 </div>

                {"username" in errors && (
                  <span className="text-red-600 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.username}
                  </span>
                )}

                {!securityQuestion && (
                  <button
                    type="button"
                    onClick={handleGetQuestion}
                    disabled={isLoading}
                    className="mt-3 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Buscando...' : 'Buscar Pergunta'}
                  </button>
                )}
              </div>

              {securityQuestion && (
                <>
                  <div className="mb-6 animate-fade-in-down">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Pergunta de Segurança
                    </label>
                    <div className="flex items-center bg-gray-100 border rounded-lg p-3">
                      <HelpCircle className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700 font-semibold">{securityQuestion}</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => { setSecurityQuestion(''); setUsername(''); setAnswer(''); setId(''); }}
                        className="text-xs text-blue-500 underline mt-1 hover:text-blue-700"
                    >
                        Não é você? Trocar usuário
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Resposta
                    </label>
                    <input
                      type="text"
                      className={`w-full border-2 rounded-lg p-3 ${"answer" in errors ? "border-red-500" : "border-gray-300 focus:border-green-600"}`}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    {"answer" in errors && (
                      <span className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.answer}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Nova Senha</label>
                    <div className="relative">
                      <input
                        type={showPass1 ? "text" : "password"}
                        className={`w-full border-2 rounded-lg p-3 pr-10 ${"newPassword" in errors ? "border-red-500" : "border-gray-300 focus:border-green-600"}`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500 hover:text-green-600 transition-colors"
                        onClick={() => setShowPass1(!showPass1)}
                      >
                        {showPass1 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {"newPassword" in errors && (
                      <span className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.newPassword}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Confirmar Senha</label>
                    <div className="relative">
                      <input
                        type={showPass2 ? "text" : "password"}
                        className={`w-full border-2 rounded-lg p-3 pr-10 ${"confirmPassword" in errors ? "border-red-500" : "border-gray-300 focus:border-green-600"}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500 hover:text-green-600 transition-colors"
                        onClick={() => setShowPass2(!showPass2)}
                      >
                        {showPass2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {"confirmPassword" in errors && (
                      <span className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Salvando...
                      </div>
                    ) : (
                      'Redefinir Senha'
                    )}
                  </button>
                </>
              )}

              {/* Botão Voltar no rodapé do Form */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center mx-auto transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar para o Login
                </button>
              </div>

            </form>
          </div>
        </div>
        <div className="text-center text-sm text-gray-600 mt-5">
          © 2024 Todos os direitos reservados
        </div>
      </div>
    </div>
  );
}