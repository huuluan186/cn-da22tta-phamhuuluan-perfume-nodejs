import { useState } from "react";
import icons from '../../assets/react-icons/icon'

const {MdKeyboardArrowUp, MdKeyboardArrowDown} = icons

const BrandFilter = ({ brands, selected, filters, setFilters }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const toggleBrand = (brandId) => {
        const newList = selected.includes(brandId)
            ? selected.filter((x) => x !== brandId)
            : [...selected, brandId];

        setFilters({ ...filters, selectedBrands: newList });
    };

    const filtered = brands.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between font-medium mb-2"
            >
                Thương hiệu
                {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>

            {open && (
                <div className="space-y-3 animate-in fade-in duration-200">
                    <input
                        placeholder="Tìm thương hiệu"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-8 px-3 border rounded-lg text-sm"
                    />

                    <div className="max-h-64 overflow-y-auto py-1">
                        {filtered.map((b) => (
                            <label
                                key={b.id}
                                className="flex items-center gap-3 px-2 py-1 rounded hover:bg-gray-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(b.id)}
                                    onChange={() => toggleBrand(b.id)}
                                />
                                <span>{b.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default BrandFilter;
