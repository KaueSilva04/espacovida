import { useState, useEffect } from 'react';
import { Search, Users, Shield, Trash2, UserPlus, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import AddUserModal from '../components/AddUserModal';
import { useListAllUsers } from '../hooks/userHooks/listAllUser.Hook';
import { useCreateUser } from '../hooks/userHooks/createUser.Hook';
import { useDeleteUser } from '../hooks/userHooks/deleteUser.Hook';
import { user } from '../interfaces/userInterfaces/user.Interface';
import { createUser } from '../interfaces/userInterfaces/createUser.Interface';
import { deleteUser } from '../interfaces/userInterfaces/deleteUser.Interface';

interface UserDisplay extends user {
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    department?: string;
    createdAt?: string;
    lastLogin?: string;
}

export default function UsuariosPage() {
    // Hooks
    const { listAllUsers, users: fetchedUsers, loading: isLoadingList, error: fetchError } = useListAllUsers();
    const { createUser: createUserMutation, loading: isCreating, error: createError } = useCreateUser();
    const { deleteUser: deleteUserMutation, loading: isDeleting, error: deleteError } = useDeleteUser();

    const [users, setUsers] = useState<UserDisplay[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    // Estados de mensagem
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Carregar usuários ao montar o componente
    useEffect(() => {
        loadUsers();
    }, []);

    // Atualizar estado local quando fetchedUsers mudar
    useEffect(() => {
        if (fetchedUsers && fetchedUsers.length > 0) {
            const mappedUsers: UserDisplay[] = fetchedUsers.map(user => ({
                ...user,
                role: user.adm ? 'admin' : 'user',
                status: 'active' as const,
                department: '-',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            }));
            setUsers(mappedUsers);
        } else if (fetchedUsers && fetchedUsers.length === 0) {
            setUsers([]);
        }
    }, [fetchedUsers]);

    const loadUsers = async () => {
        try {
            console.log('Carregando usuários...');
            await listAllUsers();
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddUser = async (newUser: any) => {
        try {
            console.log('=== PAGE - CRIANDO USUÁRIO ===');
            console.log('newUser recebido:', newUser);

            setSuccessMessage(null);
            setErrorMessage(null);

            // ✅ Mapear para a interface createUser (incluindo question e answer)
            const userData: createUser = {
                username: newUser.username,
                password: newUser.password,
                question: newUser.question,
                answer: newUser.answer,
                adm: newUser.isAdmin
            };

            console.log('PAGE - Dados a enviar:', userData);

            const result = await createUserMutation(userData);

            if (result) {
                console.log('PAGE - Usuário criado com sucesso:', result);
                setSuccessMessage(`Usuário "${newUser.username}" criado com sucesso!`);

                setTimeout(() => setSuccessMessage(null), 4000);

                await loadUsers();
                setShowAddUserModal(false);
            } else {
                console.error('PAGE - Erro: result nulo');
                setErrorMessage(`Erro ao criar usuário: ${createError || 'Erro desconhecido'}`);
                setTimeout(() => setErrorMessage(null), 4000);
            }
        } catch (error) {
            console.error('PAGE - Erro ao criar usuário:', error);
            const errorMsg = error instanceof Error ? error.message : 'Erro ao criar usuário. Tente novamente.';
            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(null), 4000);
        }
    };

    const confirmDeleteUser = async (id: number) => {
        try {
            console.log('=== EXCLUINDO USUÁRIO ===');
            setSuccessMessage(null);
            setErrorMessage(null);

            const userData: deleteUser = { id };

            console.log('Excluindo usuário com ID:', id);

            await deleteUserMutation(userData);

            console.log('=== USUÁRIO EXCLUÍDO COM SUCESSO ===');
            setSuccessMessage('Usuário excluído com sucesso!');

            setTimeout(() => setSuccessMessage(null), 4000);

            await loadUsers();
            setUserToDelete(null);

        } catch (error) {
            console.error('=== ERRO AO EXCLUIR USUÁRIO ===');
            console.error('Erro:', error);

            let errorMsg = 'Erro ao excluir usuário.';
            if (error instanceof Error) {
                errorMsg = error.message;
            }
            if (deleteError) {
                errorMsg = deleteError;
            }

            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(null), 4000);
            setUserToDelete(null);
        }
    };

    // 🎨 DARK MODE: Funções de Badge atualizadas
    const getRoleBadge = (role: string) => {
        const badges = {
            admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            user: 'bg-gray-100 text-gray-800 dark:bg-dark-border dark:text-dark-text-secondary'
        };
        const labels = {
            admin: 'Administrador',
            user: 'Usuário'
        };
        return { class: badges[role as keyof typeof badges], label: labels[role as keyof typeof labels] };
    };

    const getStatusBadge = (status: string) => {
        return status === 'active'
            ? { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Ativo' }
            : { class: 'bg-gray-100 text-gray-800 dark:bg-dark-border dark:text-dark-text-secondary', label: 'Inativo' };
    };

    const isLoading = isLoadingList || isCreating || isDeleting;
    const currentError = fetchError || createError || deleteError;

    return (
        <div className="max-w-7xl mx-auto ">
            
            {/* Mensagem de Sucesso */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-r-lg flex items-start gap-3 animate-fadeIn">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">Sucesso!</p>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">{successMessage}</p>
                    </div>
                    <button
                        onClick={() => setSuccessMessage(null)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-all"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Mensagem de Erro */}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Erro</p>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">{errorMessage}</p>
                    </div>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-all"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Header / Filtros / Stats */}
            {/* 🎨 DARK MODE: Card principal */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-6 mb-6 ">
                {/* NOVO BLOCO: Título e Botão de Ação */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    
                    {/* CONTEÚDO NOVO NA ESQUERDA: Subtítulo/Descrição */}
                    <div>
                        <p className="text-xl font-bold text-gray-800 dark:text-dark-text-primary mb-1">
                            Estatísticas de Acesso
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                            Visão geral rápida sobre os usuários e seus papéis no sistema.
                        </p>
                    </div>
                    {/* FIM CONTEÚDO NOVO */}
                    
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        disabled={isCreating}
                        className={`text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2 ${isCreating
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                            }`}
                    >
                        <UserPlus className="w-5 h-5" />
                        {isCreating ? 'Criando...' : 'Novo Usuário'}
                    </button>
                </div>

                {/* Stats */}
                {/* 🎨 DARK MODE: Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Card 1: Total */}
                    <div className="
        bg-gradient-to-br from-blue-50 to-blue-100 
        dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
        p-4 rounded-lg
    ">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Ativos */}
                    <div className="
        bg-gradient-to-br from-green-50 to-green-100 
        dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
        p-4 rounded-lg
    ">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Ativos</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                                    {users.filter(u => u.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Admins */}
                    <div className="
        bg-gradient-to-br from-red-50 to-red-100 
        dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
        p-4 rounded-lg
    ">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                            <div>
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Admins</p>
                                <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                                    {users.filter(u => u.adm).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Usuários */}
                    <div className="
        bg-gradient-to-br from-purple-50 to-purple-100 
        dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
        p-4 rounded-lg
    ">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Usuários</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                                    {users.filter(u => !u.adm).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                {/* 🎨 DARK MODE: Inputs de Filtro */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary rounded-lg focus:border-green-600 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="relative min-w-[180px]">
                        <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary rounded-lg focus:border-green-600 focus:outline-none transition-all appearance-none"
                        >
                            <option value="all">Todas as Funções</option>
                            <option value="admin">Administrador</option>
                            <option value="user">Usuário</option>
                        </select>
                    </div>

                    <div className="relative min-w-[180px]">
                        <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary rounded-lg focus:border-green-600 focus:outline-none transition-all appearance-none"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                </div>

                {/* Erro Geral ao Carregar */}
                {currentError && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Erro: {currentError}</span>
                    </div>
                )}
            </div>

            {/* Mensagem de Confirmação de Exclusão */}
            {userToDelete !== null && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Confirmar exclusão</p>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                            Tem certeza que deseja excluir o usuário <strong>{users.find(u => u.id === userToDelete)?.username}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => confirmDeleteUser(userToDelete)}
                                disabled={isDeleting}
                                className={`px-3 py-1.5 text-xs rounded transition-all ${isDeleting
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                            >
                                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
                            </button>
                            <button
                                onClick={() => setUserToDelete(null)}
                                disabled={isDeleting}
                                className="px-3 py-1.5 text-xs border border-red-600 dark:border-red-500 text-red-700 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela de Usuários */}
            {/* 🎨 DARK MODE: Card da Tabela */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg overflow-hidden">
                {isLoadingList ? (
                    <div className="text-center p-12 text-gray-500 dark:text-dark-text-secondary">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                        <p>Carregando usuários...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center p-12 text-gray-500 dark:text-dark-text-secondary">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-semibold">Nenhum usuário encontrado</p>
                        <p className="text-sm mt-2">
                            {users.length === 0
                                ? 'Adicione o primeiro usuário clicando no botão acima'
                                : 'Tente ajustar os filtros de pesquisa'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="
                                bg-gradient-to-r from-green-600 to-green-700 text-white 
                                dark:bg-none dark:bg-dark-header
                            ">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Função</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                                </tr>
                            </thead>
                            {/* 🎨 DARK MODE: Divisor da tabela e cores de linha */}
                            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                {filteredUsers.map((user, index) => {
                                    const roleBadge = getRoleBadge(user.role);
                                    const statusBadge = getStatusBadge(user.status);

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-dark-surface' : 'bg-gray-50 dark:bg-dark-bg'
                                                } hover:bg-gray-100 dark:hover:bg-dark-border`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="
                                                        w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                                                        bg-gradient-to-br from-green-500 to-green-700
                                                        dark:bg-none dark:bg-dark-header
                                                    ">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-800 dark:text-dark-text-primary">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.class}`}>
                                                    <Shield className="w-3 h-3" />
                                                    {roleBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setUserToDelete(user.id)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
                                                        title="Remover usuário"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                onSave={handleAddUser}
            />

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}