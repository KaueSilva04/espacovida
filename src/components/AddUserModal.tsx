import { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle, HelpCircle, Shield, Save, X } from 'lucide-react';
import ModalComponent from './Modal'; // Seu componente de modal já com dark mode

interface NewUser {
    username: string;
    password: string;
    confirmPassword: string;
    question: string;
    answer: string;
    isAdmin: boolean;
}

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (user: NewUser) => Promise<void>;
}

export default function AddUserModal({ isOpen, onClose, onSave }: AddUserModalProps) {
    const [formData, setFormData] = useState<NewUser>({
        username: '',
        password: '',
        confirmPassword: '',
        question: '',
        answer: '',
        isAdmin: false
    });

    // ... (O restante dos seus hooks e funções permanece o mesmo) ...
    // [isSaving, showPassword, showConfirmPassword, errors, passwordStrength]
    // [securityQuestions, validateUsername, validatePasswordStrength, handlePasswordChange]
    // [validateForm, handleSubmit, handleClose, getPasswordStrengthColor, getPasswordStrengthWidth]
    // ... (Vou omitir a lógica interna que não muda para focar no JSX) ...

    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof NewUser, string>>>({});
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

    const securityQuestions = [
        'Qual o nome do seu primeiro animal de estimação?',
        'Em qual cidade você nasceu?',
        'Qual o nome de solteira da sua mãe?',
        'Qual era o nome da sua primeira escola?',
        'Qual o seu filme favorito?',
        'Qual o nome da rua onde você cresceu?',
        'Qual o seu livro favorito?',
        'Qual o nome do seu melhor amigo de infância?'
    ];

    const validateUsername = (username: string): boolean => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    const validatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;

        const criteriasMet = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length;

        if (criteriasMet <= 2) return 'weak';
        if (criteriasMet <= 4) return 'medium';
        return 'strong';
    };

    const handlePasswordChange = (password: string) => {
        setFormData({ ...formData, password });
        if (password) {
            setPasswordStrength(validatePasswordStrength(password));
        } else {
            setPasswordStrength(null);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof NewUser, string>> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username é obrigatório';
        } else if (!validateUsername(formData.username)) {
            newErrors.username = 'Username deve ter 3-20 caracteres (letras, números e _)';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirme a senha';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        if (!formData.question.trim()) {
            newErrors.question = 'Pergunta de segurança é obrigatória';
        }

        if (!formData.answer.trim()) {
            newErrors.answer = 'Resposta é obrigatória';
        } else if (formData.answer.length < 3) {
            newErrors.answer = 'Resposta deve ter no mínimo 3 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        console.log('=== Modal - SUBMIT ===');
        console.log('FormData:', formData);

        if (!validateForm()) {
            console.log('Modal - Validação falhou');
            return;
        }

        setIsSaving(true);
        try {
            if (onSave) {
                console.log('Modal - Enviando para página:', formData);
                await onSave(formData);
                console.log('Modal - Sucesso!');
            }
            handleClose();
        } catch (error) {
            console.error('Modal - Erro ao criar usuário:', error);
            const errorMsg = error instanceof Error ? error.message : 'Erro ao criar usuário';
            setErrors({ username: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setFormData({
            username: '',
            password: '',
            confirmPassword: '',
            question: '',
            answer: '',
            isAdmin: false
        });
        setErrors({});
        setPasswordStrength(null);
        onClose();
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-green-500';
            default: return 'bg-gray-300 dark:bg-dark-border'; // 🎨 DARK MODE
        }
    };

    const getPasswordStrengthWidth = () => {
        switch (passwordStrength) {
            case 'weak': return 'w-1/3';
            case 'medium': return 'w-2/3';
            case 'strong': return 'w-full';
            default: return 'w-0';
        }
    };

    if (!isOpen) return null;

    return (
        <ModalComponent
            Titulo="Adicionar Novo Usuário"
            OnClickClose={handleClose}
            width="550px"
            height=""
        >

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2
                scrollbar-thin
                scrollbar-track-transparent
                scrollbar-thumb-rounded-full
                scrollbar-thumb-gray-300
                hover:scrollbar-thumb-gray-400
                active:scrollbar-thumb-green-500
                dark:scrollbar-thumb-dark-border
                dark:hover:scrollbar-thumb-dark-text-secondary
                dark:active:scrollbar-thumb-green-600 ">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 max-h-[500px] overflow-y-auto pr-2
                    scrollbar-thin
                    scrollbar-track-transparent
                    scrollbar-thumb-rounded-full
                    scrollbar-thumb-gray-300
                    hover:scrollbar-thumb-gray-400
                    active:scrollbar-thumb-green-500
                    dark:scrollbar-thumb-dark-border
                    dark:hover:scrollbar-thumb-dark-text-secondary
                    dark:active:scrollbar-thumb-green-600
               "
                >
                    {/* Username */}
                    <div>
                        {/* 🎨 DARK MODE: Cor do texto do label */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                            <User className="w-4 h-4 text-green-600" />
                            Username *
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            /* 🎨 DARK MODE: Cor de fundo, borda, texto e placeholder do input */
                            className={`w-full px-4 py-2.5 text-sm border-2 rounded-lg transition-all focus:outline-none 
                                bg-white dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder-gray-400
                                ${errors.username
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-dark-border focus:border-green-600'
                                }`}
                            placeholder="Digite o username (3-20 caracteres)"
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.username}
                            </p>
                        )}
                        {/* 🎨 DARK MODE: Cor do texto de ajuda */}
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                            Apenas letras, números e underscore (_)
                        </p>
                    </div>

                    {/* Senha */}
                    <div>
                        {/* 🎨 DARK MODE: Cor do texto do label */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                            <Lock className="w-4 h-4 text-green-600" />
                            Senha *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                /* 🎨 DARK MODE: Cor de fundo, borda, texto e placeholder do input */
                                className={`w-full px-4 py-2.5 pr-10 text-sm border-2 rounded-lg transition-all focus:outline-none 
                                    bg-white dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder-gray-400
                                    ${errors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 dark:border-dark-border focus:border-green-600'
                                    }`}
                                placeholder="Mínimo 8 caracteres"
                            />
                            {/* 🎨 DARK MODE: Cor do ícone */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.password}
                            </p>
                        )}

                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    {/* 🎨 DARK MODE: Cor do texto */}
                                    <span className="text-xs text-gray-600 dark:text-dark-text-secondary">Força da senha:</span>
                                    <span className={`text-xs font-semibold ${passwordStrength === 'weak' ? 'text-red-600' :
                                            passwordStrength === 'medium' ? 'text-yellow-600' : // Cor do 'medium' ok para dark
                                                'text-green-600'
                                        }`}>
                                        {passwordStrength === 'weak' ? 'Fraca' :
                                            passwordStrength === 'medium' ? 'Média' : 'Forte'}
                                    </span>
                                </div>
                                {/* 🎨 DARK MODE: Fundo da barra */}
                                <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirmar Senha */}
                    <div>
                        {/* 🎨 DARK MODE: Cor do texto do label */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                            <Lock className="w-4 h-4 text-green-600" />
                            Confirmar Senha *
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                /* 🎨 DARK MODE: Cor de fundo, borda, texto e placeholder do input */
                                className={`w-full px-4 py-2.5 pr-10 text-sm border-2 rounded-lg transition-all focus:outline-none 
                                    bg-white dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder-gray-400
                                    ${errors.confirmPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 dark:border-dark-border focus:border-green-600'
                                    }`}
                                placeholder="Digite a senha novamente"
                            />
                            {/* 🎨 DARK MODE: Cor do ícone */}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.confirmPassword}
                            </p>
                        )}
                        {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                As senhas coincidem
                            </p>
                        )}
                    </div>

                    {/* Pergunta de Segurança */}
                    <div>
                        {/* 🎨 DARK MODE: Cor do texto do label */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                            <HelpCircle className="w-4 h-4 text-green-600" />
                            Pergunta de Segurança *
                        </label>
                        <select
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            /* 🎨 DARK MODE: Cor de fundo, borda e texto do select */
                            className={`w-full px-4 py-2.5 text-sm border-2 rounded-lg transition-all focus:outline-none 
                                bg-white dark:bg-dark-bg dark:text-dark-text-primary
                                ${errors.question
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-dark-border focus:border-green-600'
                                }`}
                        >
                            <option value="">Selecione uma pergunta</option>
                            {securityQuestions.map((q, index) => (
                                <option key={index} value={q}>{q}</option>
                            ))}
                        </select>
                        {errors.question && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.question}
                            </p>
                        )}
                    </div>

                    {/* Resposta */}
                    <div>
                        {/* 🎨 DARK MODE: Cor do texto do label */}
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                            <HelpCircle className="w-4 h-4 text-green-600" />
                            Resposta *
                        </label>
                        <input
                            type="text"
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            /* 🎨 DARK MODE: Cor de fundo, borda, texto e placeholder do input */
                            className={`w-full px-4 py-2.5 text-sm border-2 rounded-lg transition-all focus:outline-none 
                                bg-white dark:bg-dark-bg dark:text-dark-text-primary dark:placeholder-gray-400
                                ${errors.answer
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-dark-border focus:border-green-600'
                                }`}
                            placeholder="Digite sua resposta"
                        />
                        {errors.answer && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.answer}
                            </p>
                        )}
                        {/* 🎨 DARK MODE: Cor do texto de ajuda */}
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                            Esta resposta será usada para recuperação de senha
                        </p>
                    </div>

                    {/* Checkbox Admin */}
                    {/* 🎨 DARK MODE: Fundo e borda da caixa do admin */}
                    <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg border-2 border-gray-200 dark:border-dark-border">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isAdmin}
                                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                                /* 🎨 DARK MODE: Borda do checkbox */
                                className="w-5 h-5 text-green-600 border-2 border-gray-300 dark:border-dark-border rounded focus:ring-2 focus:ring-green-500 cursor-pointer
                                           dark:bg-dark-surface" // Fundo do checkbox
                            />
                            <div className="flex items-center gap-2">
                                <Shield className={`w-5 h-5 ${formData.isAdmin ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}`} />
                                <div>
                                    {/* 🎨 DARK MODE: Cor dos textos */}
                                    <span className="text-sm font-semibold text-gray-800 dark:text-dark-text-primary">
                                        Administrador
                                    </span>
                                    <p className="text-xs text-gray-600 dark:text-dark-text-secondary">
                                        Concede privilégios administrativos ao usuário
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>
                </form>

                {/* Botões de Ação */}
                {/* 🎨 DARK MODE: Borda superior */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        /* 🎨 DARK MODE: Borda, texto e hover do botão cancelar */
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 
                                   border-gray-300 dark:border-dark-border 
                                   text-gray-700 dark:text-dark-text-secondary 
                                   text-sm rounded-lg font-semibold 
                                   hover:bg-gray-50 dark:hover:bg-dark-border 
                                   transition-all disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`flex-1 flex items-center justify-center gap-2 text-white text-sm px-4 py-2.5 rounded-lg font-semibold shadow-lg transition-all ${isSaving
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                            }`}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Salvando...' : 'Criar Usuário'}
                    </button>
                </div>
            </div>
        </ModalComponent>
    );
}