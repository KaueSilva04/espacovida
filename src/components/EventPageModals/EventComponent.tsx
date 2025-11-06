import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";

export default function EventComponent({ key, titulo, descricao, data, hora, localizacao, imageUrl, deleteFunction, clickFunction, passado }:
    { key: number, titulo: string, descricao: string, data: string, hora: string, localizacao: string, imageUrl?: string, deleteFunction: (e: any) => void, clickFunction: () => void, passado: boolean }) {
    
    // Define as classes de cor com base no status (passado ou não) e no modo escuro
    const cardClasses = (passado
        // Evento passado: bg-slate-100 no light mode, dark:bg-dark-surface com 80% de opacidade no dark mode
        ? "bg-slate-100 dark:bg-dark-surface dark:bg-opacity-80" 
        // Evento futuro: bg-white no light mode, dark:bg-dark-surface (100% opacidade) no dark mode
        : "bg-white dark:bg-dark-surface") + 
        " rounded-xl shadow-lg dark:shadow-none p-6 hover:shadow-xl dark:hover:bg-dark-border transition-all cursor-pointer transform hover:scale-[1.02]"; // Classes comuns

    return (
        <div
            key={key}
            className={cardClasses}
            onClick={clickFunction}
        >
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={titulo + "_cover"}
                    // Adiciona uma borda sutil no modo escuro
                    className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-100 dark:border-dark-border"
                />
            )}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                    {/* Título com dark mode */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary mb-2">{titulo}</h3>
                    {/* Descrição com dark mode */}
                    <p className="text-gray-600 dark:text-dark-text-secondary mb-4">{descricao}</p>
                    {/* Textos dos ícones com dark mode */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-dark-text-secondary">
                        <div className="flex items-center gap-2">
                            {/* Ícone com dark mode */}
                            <Calendar className="w-4 h-4 text-green-600 dark:text-green-500" />
                            {new Date(data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Ícone com dark mode */}
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                            {hora}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Ícone com dark mode */}
                            <MapPin className="w-4 h-4 text-red-600 dark:text-red-500" />
                            {localizacao}
                        </div>
                    </div>
                </div>
                <div className="flex md:flex-col gap-2">
                    <button
                        onClick={deleteFunction}
                        // Botão de deletar com dark mode
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}