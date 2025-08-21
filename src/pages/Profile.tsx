import React, { useState, ChangeEvent } from 'react';
import PageContainer from '../components/ui/PageContainer';
import { User, Camera, Mail, Lock } from 'lucide-react';

// Estilo para os inputs, similar ao que já usamos
const inputClass = 'w-full bg-transparent px-1 py-2 border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-primary placeholder:text-gray-400 placeholder:italic';

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
    const [profileImage, setProfileImage] = useState<string | null>('/user.png');
    const [userData, setUserData] = useState({
        nome: 'Stéfani Soares Freire',
        email: 'stefani@diasenunes.com.br',
    });
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageContainer title="Meu Perfil">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Coluna da Esquerda: Foto e Informações Básicas */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-accent text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4 group">
                            <img
                                src={profileImage || undefined}
                                alt="Foto do Perfil"
                                className="w-full h-full rounded-full object-cover border-4 border-accent"
                            />
                            <label
                                htmlFor="profile-upload"
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </label>
                            <input
                                type="file"
                                id="profile-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <h2 className="text-xl font-bold text-text-secondary">{userData.nome}</h2>
                        <p className="text-sm text-gray-500">Sócio Administrador</p>
                    </div>
                </div>

                {/* Coluna da Direita: Abas para edição */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-accent">
                        {/* Abas de Navegação */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex space-x-6">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`py-2 px-1 font-medium ${activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    Informações Pessoais
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`py-2 px-1 font-medium ${activeTab === 'password' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
                                >
                                    Alterar Senha
                                </button>
                            </nav>
                        </div>

                        {/* Conteúdo da Aba */}
                        {activeTab === 'info' && (
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-text-primary mb-1">Nome Completo</label>
                                    <input type="text" id="nome" name="nome" value={userData.nome} onChange={handleInfoChange} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">Endereço de Email</label>
                                    <input type="email" id="email" name="email" value={userData.email} onChange={handleInfoChange} className={inputClass} />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="current" className="block text-sm font-medium text-text-primary mb-1">Senha Atual</label>
                                    <input type="password" id="current" name="current" value={passwords.current} onChange={handlePasswordChange} className={inputClass} placeholder="Digite sua senha atual" />
                                </div>
                                <div>
                                    <label htmlFor="new" className="block text-sm font-medium text-text-primary mb-1">Nova Senha</label>
                                    <input type="password" id="new" name="new" value={passwords.new} onChange={handlePasswordChange} className={inputClass} placeholder="Mínimo 8 caracteres" />
                                </div>
                                <div>
                                    <label htmlFor="confirm" className="block text-sm font-medium text-text-primary mb-1">Confirmar Nova Senha</label>
                                    <input type="password" id="confirm" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className={inputClass} placeholder="Repita a nova senha" />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors">
                                        Alterar Senha
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </PageContainer>
    );
};

export default Profile;