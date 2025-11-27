import { useState } from "react";
import { Button } from "..";
import { DetailTab, UsageTab, ShippingTab } from '../index'

const ProductTabs = ({ product, selectedVariant }) => {
    const [activeTab, setActiveTab] = useState("detail");

    const tabs = [
        { id: "detail", label: "Chi tiết sản phẩm" },
        { id: "usage", label: "Hướng dẫn sử dụng và bảo quản" },
        { id: "shipping", label: "Vận chuyển và đổi trả" },
    ];

    return (
        <>
            <div className="flex border-b border-gray-300 relative">
                {tabs.map(tab => (
                    <div key={tab.id} className="flex-1 relative">
                        <Button
                            text={tab.label}
                            onClick={() => setActiveTab(tab.id)}
                            width="flex-1"
                            height="h-auto"
                            textSize="text-lg font-semibold"
                            bgColor="bg-transparent"
                            textColor={activeTab === tab.id ? "text-gray-800" : "text-gray-400"}
                            hoverText="hover:none"
                            hoverBg="hover:bg-gray-100"
                            className="w-full py-4 text-center relative z-10"
                        />
                        {/* Đường viền dưới đè lên border chung */}
                        {activeTab === tab.id && (
                            <div className="absolute inset-x-0 bottom-0 translate-y-1/2 border-b-4 border-primary" />
                        )}
                    </div>
                ))}
            </div>

            <div className="p-8 text-gray-700 leading-relaxed">
                {
                    activeTab === "detail" && 
                        <DetailTab product={product} selectedVariant={selectedVariant}/> 
                }
                {activeTab === "usage" && <UsageTab/> }
                {activeTab === "shipping" && <ShippingTab/> }
            </div>
        </>
    );
}

export default ProductTabs;