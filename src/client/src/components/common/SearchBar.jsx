import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icons from "../../assets/react-icons/icon";
import { path } from "../../constants/path";
import {Button} from "../index";

const { FiSearch } = icons;

const SearchBar = ({
    rounded = '',
    width = '',
    height = '',
    placeholder = '',
    
}) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();

        if (!q) return;

        // Điều hướng sang /search?query=abc
        navigate(`${path.SEARCH}?query=${encodeURIComponent(q)}`);
        setQuery('');
    };

    return (
        <form 
            onSubmit={handleSearch}
            className={`${rounded} ${width} ${height} flex items-center  bg-contentBg overflow-hidden`}
        >
            <input 
                type="text" 
                placeholder={placeholder} 
                spellCheck="false"
                className="w-full p-2 focus:outline-none text-gray-500"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
            />
            <Button
                type="submit"
                width="w-10"
                height={height}
                bgColor="bg-contentBg"
                textColor="text-gray-500"
                rounded={rounded}
                IcBefore={FiSearch}
                //onClick={handleSearch}
            />
        </form>
    );
}

export default SearchBar
