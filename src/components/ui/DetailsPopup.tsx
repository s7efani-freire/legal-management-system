import React from 'react';
import { X } from 'lucide-react';

export interface DetailItem {
    icon?: React.ReactNode;
    label: string;
    value: string | number | null;
    isFullWidth?: boolean; 
}

interface DetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    details: DetailItem[];
}

const DetailsPopup: React.FC<DetailsPopupProps> = ({ isOpen, onClose, title, details }) => {
    if (!isOpen) {
        return null;
    }
    
    const normalDetails = details.filter(d => !d.isFullWidth);
    const fullWidthDetail = details.find(d => d.isFullWidth);

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-3xl rounded-lg shadow-xl transform transition-all">
                
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-text-secondary">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        {normalDetails.map((detail, index) => (
                            <DetailItemComponent key={index} {...detail} />
                        ))}
                    </div>
                    {fullWidthDetail && fullWidthDetail.value && (
                        <div>
                            <h4 className="font-semibold text-text-primary mb-1">{fullWidthDetail.label}</h4>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{fullWidthDetail.value}</p>
                        </div>
                    )}
                </div>

                
                <div className="flex items-center justify-end p-6 border-t border-gray-200">
                    <button onClick={onClose} className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary-dark transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};


const DetailItemComponent: React.FC<DetailItem> = ({ icon, label, value }) => {
    const formattedValue = typeof value === 'number' ? `R$ ${value.toFixed(2).replace('.', ',')}` : value;
    return (
        <div className='flex items-start space-x-3'>
            {icon && <span className='text-primary mt-1'>{React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}</span>}
            <div>
                <p className="font-semibold text-text-primary">{label}</p>
                <p className="text-gray-600 break-words">{formattedValue || 'N/A'}</p>
            </div>
        </div>
    );
};

export default DetailsPopup;