import { Calendar, Clock, MapPin, Users, Trash2 } from "lucide-react"

export default function EventComponent({ key, titulo, descricao, data, hora, localizacao, imageUrl, deleteFunction, clickFunction }:
    { key: number, titulo: string, descricao: string, data: string, hora: string, localizacao: string, imageUrl?: string, deleteFunction: (e: any) => void, clickFunction: () => void }) {
    return (<div
        key={key}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
        onClick={clickFunction}
    >

        {imageUrl && (
            <img
                src={imageUrl}
                alt={titulo + "_cover"}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
        )}
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{titulo}</h3>
                <p className="text-gray-600 mb-4">{descricao}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {new Date(data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {hora}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        {localizacao}
                    </div>
                </div>
            </div>
            <div className="flex md:flex-col gap-2">
                <button
                    onClick={deleteFunction}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>)
}