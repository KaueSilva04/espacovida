import { useState, useEffect } from 'react';
import { Search, Users, Mail, Shield, Calendar, Edit2, Trash2, UserPlus, Filter, AlertCircle } from 'lucide-react';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';

interface User {
    iduser: number;
    username: string;
    role: 'admin' | 'manager' | 'user';
    status: 'active' | 'inactive';
    department?: string;
    createdAt?: string;
    lastLogin?: string;
    question?: string;
    answer?: string;
    isAdmin: boolean;
}

interface NewUser {
    username: string;
    password: string;
    confirmPassword: string;
    question: string;
    answer: string;
    isAdmin: boolean;
}

export default function UsuariosPage() {
    const [users, setUsers] = useState<User[]>([
        {
            iduser: 1,
            username: 'joao_silva',
            role: 'admin',
            status: 'active',
            department: 'TI',
            createdAt: '2025-01-15',
            lastLogin: '2025-11-04',
            question: 'Qual o nome do seu primeiro animal de estimação?',
            answer: 'Rex',
            isAdmin: true
        },
        {
            iduser: 2,
            username: 'maria_santos',
            role: 'manager',
            status: 'active',
            department: 'Eventos',
            createdAt: '2025-02-20',
            lastLogin: '2025-11-03',
            question: 'Em qual cidade você nasceu?',
            answer: 'São Paulo',
            isAdmin: false
        },
        {
            iduser: 3,
            username: 'pedro_costa',
            role: 'user',
            status: 'active',
            department: 'Marketing',
            createdAt: '2025-03-10',
            lastLogin: '2025-11-02',
            question: 'Qual o seu filme favorito?',
            answer: 'Matrix',
            isAdmin: false
        },
        {
            iduser: 4,
            username: 'ana_oliveira',
            role: 'user',
            status: 'inactive',
            department: 'RH',
            createdAt: '2025-04-05',
            lastLogin: '2025-10-20',
            question: 'Qual o nome da sua primeira escola?',
            answer: 'Colégio Central',
            isAdmin: false
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        // fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddUser = async (newUser: NewUser) => {
        console.log('Criando usuário:', newUser);
        
        const user: User = {
            iduser: users.length + 1,
            username: newUser.username,
            role: newUser.isAdmin ? 'admin' : 'user',
            status: 'active',
            department: 'Novo Departamento',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            question: newUser.question,
            answer: newUser.answer,
            isAdmin: newUser.isAdmin
        };

        setUsers([...users, user]);
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleEditUser = async (updatedUser: User & { newPassword?: string }) => {
        console.log('Editando usuário:', updatedUser);
        
        setUsers(users.map(u => 
            u.iduser === updatedUser.iduser 
                ? { 
                    ...u, 
                    username: updatedUser.username,
                    question: updatedUser.question,
                    answer: updatedUser.answer,
                    isAdmin: updatedUser.isAdmin,
                    role: updatedUser.isAdmin ? 'admin' : 'user'
                  } 
                : u
        ));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const confirmDeleteUser = (id: number) => {
        setUsers(users.filter(u => u.iduser !== id));
        setUserToDelete(null);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setShowEditUserModal(true);
    };

    const getRoleBadge = (role: string) => {
        const badges = {
            admin: 'bg-red-100 text-red-800',
            manager: 'bg-blue-100 text-blue-800',
            user: 'bg-gray-100 text-gray-800'
        };
        const labels = {
            admin: 'Administrador',
            manager: 'Gerente',
            user: 'Usuário'
        };
        return { class: badges[role as keyof typeof badges], label: labels[role as keyof typeof labels] };
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' 
            ? { class: 'bg-green-100 text-green-800', label: 'Ativo' }
            : { class: 'bg-gray-100 text-gray-800', label: 'Inativo' };
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Usuários</h1>
                        <p className="text-gray-600">Gerencie os usuários do sistema</p>
                    </div>
                    <button 
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Novo Usuário
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total</p>
                                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm text-green-600 font-medium">Ativos</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {users.filter(u => u.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-sm text-red-600 font-medium">Admins</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-sm text-purple-600 font-medium">Gerentes</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {users.filter(u => u.role === 'manager').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por username ou departamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="relative min-w-[180px]">
                        <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all appearance-none bg-white"
                        >
                            <option value="all">Todas as Funções</option>
                            <option value="admin">Administrador</option>
                            <option value="manager">Gerente</option>
                            <option value="user">Usuário</option>
                        </select>
                    </div>

                    <div className="relative min-w-[180px]">
                        <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-all appearance-none bg-white"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Mensagem de Confirmação de Exclusão */}
            {userToDelete !== null && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800">Confirmar exclusão</p>
                        <p className="text-xs text-red-700 mt-1">
                            Tem certeza que deseja excluir o usuário <strong>{users.find(u => u.iduser === userToDelete)?.username}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => confirmDeleteUser(userToDelete)}
                                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                            >
                                Sim, excluir
                            </button>
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="px-3 py-1.5 text-xs border border-red-600 text-red-700 rounded hover:bg-red-50 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela de Usuários */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="text-center p-12 text-gray-500">
                        Carregando usuários...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-semibold">Nenhum usuário encontrado</p>
                        <p className="text-sm mt-2">Tente ajustar os filtros de pesquisa</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Função</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Departamento</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Último Login</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => {
                                    const roleBadge = getRoleBadge(user.role);
                                    const statusBadge = getStatusBadge(user.status);
                                    
                                    return (
                                        <tr 
                                            key={user.iduser}
                                            className={`hover:bg-gray-50 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.class}`}>
                                                    <Shield className="w-3 h-3" />
                                                    {roleBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{user.department || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Editar usuário"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setUserToDelete(user.iduser)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

            <EditUserModal
                isOpen={showEditUserModal}
                onClose={() => {
                    setShowEditUserModal(false);
                    setSelectedUser(null);
                }}
                userData={selectedUser}
                onSave={handleEditUser}
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
