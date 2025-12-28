import { useDispatch, useSelector } from "react-redux";
import { getAllBrands } from "../../store/actions/brand";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../utils";
import { path } from "../../constants/path";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BrandsListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { brands } = useSelector(state => state.brand);
    const [activeLetter, setActiveLetter] = useState(null);
    const STICKY_OFFSET = 200;

    useEffect(() => {
        dispatch(getAllBrands());
    }, [dispatch]);

    // ===== GROUP BRAND THEO CHỮ CÁI =====
    const groupedBrands = useMemo(() => {
        const map = {};
        ALPHABET.forEach(l => (map[l] = []));

        brands.forEach(brand => {
            const firstChar = brand.name?.charAt(0).toUpperCase();
            if (map[firstChar]) {
                map[firstChar].push(brand);
            }
        });

        // sort tên trong từng group
        Object.keys(map).forEach(key => {
            map[key].sort((a, b) =>
                a.name.localeCompare(b.name, "vi")
            );
        });

        return map;
    }, [brands]);

    // ===== SCROLL TO LETTER (CLICK) =====
    const scrollToLetter = (letter) => {
        setActiveLetter(letter);
        const el = document.getElementById(`brand-${letter}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // ===== AUTO ACTIVE LETTER WHEN SCROLL =====
    useEffect(() => {
        const onScroll = () => {
            let current = null;

            for (let i = 0; i < ALPHABET.length; i++) {
                const letter = ALPHABET[i];
                const el = document.getElementById(`brand-${letter}`);
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                if (rect.top - STICKY_OFFSET <= 0) {
                    current = letter;
                }
            }

            if (current && current !== activeLetter) {
                setActiveLetter(current);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [activeLetter]);


    return (
        <>
            {/* ===== ALPHABET BAR (STICKY) ===== */}
            <div className="sticky top-32 z-40 bg-white border-b">
                <div className="container py-3">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {ALPHABET.map(letter => (
                            <button
                                key={letter}
                                onClick={() => scrollToLetter(letter)}
                                className={`
                                    w-8 h-8 text-sm font-medium border rounded transition
                                    ${activeLetter === letter
                                        ? "bg-black text-white border-black"
                                        : "hover:bg-black hover:text-white"
                                    }
                                `}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== BRAND LIST ===== */}
            <div className="container py-10 bg-contentBg space-y-12">
                {ALPHABET.map(letter => {
                    const list = groupedBrands[letter];
                    if (!list || list.length === 0) return null;

                    return (
                        <div 
                            key={letter} 
                            id={`brand-${letter}`} 
                            style={{ scrollMarginTop: STICKY_OFFSET }}
                        >
                            <h2 className="text-2xl font-semibold mb-6">
                                {letter}
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {list.map(brand => (
                                    <div
                                        onClick={() =>
                                            navigate(
                                                path.BRAND_DETAIL.replace(
                                                    ':slug',
                                                    toSlug(brand.name)
                                                ),
                                                { state: { brandId: brand.id } }
                                            )
                                        }
                                        key={brand.id}
                                        className="
                                            group flex items-center gap-3 p-3 border rounded
                                            cursor-pointer transition
                                            hover:shadow-md hover:border-black
                                        "
                                    >
                                        {brand.logoUrl && (
                                            <img
                                                src={brand.logoUrl}
                                                alt={brand.name}
                                                className="w-12 h-12 object-contain transition group-hover:scale-105"
                                            />
                                        )}
                                        <span className="text-sm font-medium transition group-hover:text-black">
                                            {brand.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default BrandsListPage;
