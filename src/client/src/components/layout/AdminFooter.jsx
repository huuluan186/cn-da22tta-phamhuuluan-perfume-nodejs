import React from 'react';

const AdminFooter = () => {
    return (
        <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-4 relative overflow-hidden'>
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-white text-base font-medium tracking-wide whitespace-nowrap">
                    © {new Date().getFullYear()} <span className="text-yellow-400 font-bold uppercase tracking-wider drop-shadow-sm">Perfumora Admin</span> <span className="text-gray-500 mx-2">|</span> ALL RIGHTS RESERVED.
                </p>

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-gray-300 font-light">
                    <p className="group cursor-default whitespace-nowrap">
                        SVTH: <span className="text-yellow-400 font-extrabold uppercase text-base tracking-wide group-hover:text-yellow-300 transition-colors drop-shadow-md">PHẠM HỮU LUÂN</span>
                        <span className="ml-2 text-gray-400 font-medium">(110122016)</span>
                    </p>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
                    <p className="group cursor-default whitespace-nowrap">
                        LỚP: <span className="text-yellow-400 font-extrabold uppercase text-base tracking-wide group-hover:text-yellow-300 transition-colors drop-shadow-md">DA22TTA</span>
                    </p>
                </div>

                <p className="text-xs text-white font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                    ĐỒ ÁN CHUYÊN NGÀNH • XÂY DỰNG HỆ THỐNG KINH DOANH NƯỚC HOA TRỰC TUYẾN
                </p>
            </div>
        </div>
    );
};

export default AdminFooter;
