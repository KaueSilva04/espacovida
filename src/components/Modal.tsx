import { X } from 'lucide-react';

export default function ModalComponent({ children, Titulo, OnClickClose, width}: { children: React.ReactNode, Titulo: string, OnClickClose: () => void, width: string, height: string | undefined }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
                style={{ width: width }}
            >
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white rounded-t-2xl sticky top-0">
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
                <div className="p-4 space-y-3">
                    {children}
                </div>
            </div>
        </div>)
}
