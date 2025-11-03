import { X } from 'lucide-react';

export default function ModalComponent({ children, Titulo, OnClickClose, width, height }: { children: React.ReactNode, Titulo: string, OnClickClose: () => void, width: string, height: string | undefined }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`bg-white rounded-2xl shadow-2xl `}
                style={{ width: width, height: height }}
            >
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{Titulo}</h2>
                        <button
                            onClick={() => {
                                OnClickClose()
                            }}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
            </div>
        </div>)
}