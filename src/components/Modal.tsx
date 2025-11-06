import { X } from 'lucide-react';

export default function ModalComponent({ children, Titulo, OnClickClose, width }: { children: React.ReactNode, Titulo: string, OnClickClose: () => void, width: string, height: string | undefined }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
            <div 
                className={`
                  bg-white dark:bg-dark-surface 
                  text-gray-900 dark:text-dark-text-primary 
                  rounded-2xl shadow-2xl 
                  max-h-[90vh] 
                  flex flex-col /* <-- 1. Adicionado para o layout funcionar */
                `}
                // 2. Removido: overflow-y-auto (passou para o 'children' wrapper)
                style={{ width: width }}
            >
                <div className="bg-gradient-to-r from-green-hope to-blue-trust p-4 text-white rounded-t-2xl sticky top-0 flex-shrink-0">
                    {/* 3. Adicionado 'flex-shrink-0' para o header não encolher */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{Titulo}</h2>
                        <button
                            onClick={() => {
                                OnClickClose()
                            }}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all flex-shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 4. A MÁGICA ACONTECE AQUI */}
                <div 
                    className="
                        p-4 space-y-3 overflow-y-auto /* <-- 5. Scroll aplicado SÓ no conteúdo */

                        /* --- Estilos da Barra de Rolagem --- */
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-rounded-full
                        
                        /* MODO CLARO (Padrão) */
                        scrollbar-thumb-gray-300
                        hover:scrollbar-thumb-gray-400
                        active:scrollbar-thumb-green-500

                        /* MODO ESCURO (Override) */
                        dark:scrollbar-thumb-dark-border
                        dark:hover:scrollbar-thumb-dark-text-secondary
                        dark:active:scrollbar-thumb-green-600
                    "
                >
                    {children}
                </div>
            </div>
        </div>
    )
}